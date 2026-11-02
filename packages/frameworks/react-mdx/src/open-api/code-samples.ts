// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  findJsonMediaType,
  getDeclaredExample,
  getExample,
  getMediaExample,
  isJsonMediaType,
  type MediaType,
} from "./get-example.js"
import type {JsonSchema} from "./schema-type.js"

export interface CodeSampleInput {
  method: string
  parameters: {
    example?: unknown
    examples?: Record<string, {value?: unknown}>
    explode?: boolean
    in: string
    name: string
    required?: boolean
    schema?: JsonSchema
  }[]
  path: string
  requestBody?: {content?: Record<string, MediaType>}
  responses?: Record<string, {content?: Record<string, MediaType>}>
  servers: OpenApiServer[]
}

export interface OpenApiServer {
  url?: string
  variables?: Record<string, {default?: string}>
}

function getServerUrl(server: OpenApiServer | undefined): string {
  const url = (server?.url ?? "https://api.example.com").replace(
    /\{([^}]+)\}/g,
    (placeholder, name: string) =>
      server?.variables?.[name]?.default ?? placeholder,
  )
  return url.replace(/\/$/, "")
}

export interface CodeSample {
  code: string
  label: string
  language: string
}

interface Request {
  body?: unknown
  contentType?: string
  headers: Record<string, string>
  method: string
  /**
   * When the sample parses the response as JSON: always, never, or only for
   * these statuses, like a `200` with a body next to an empty `204`.
   */
  parseJson: boolean | number[]
  url: string
}

/**
 * How the sample handles the success responses. A response that offers JSON
 * among other formats gets an `Accept` header, so parsing it is safe.
 * Explicit statuses take precedence over ranges like `2XX`.
 */
function getResponseHandling(
  method: string,
  responses: CodeSampleInput["responses"] = {},
): {accept?: string; parseJson: Request["parseJson"]} {
  const success = Object.entries(responses)
    .filter(([code]) => /^2(\d\d|XX)$/i.test(code))
    .map(([code, response]) => {
      const content = response.content ?? {}
      return {
        code,
        json: findJsonMediaType(content),
        otherFormats: Object.keys(content).length > 1,
      }
    })
  const json = success.filter((response) => response.json)
  if (method === "HEAD" || !json.length) {
    return {parseJson: false}
  }
  const accept = json.find((response) => response.otherFormats)?.json
  if (json.length === success.length) {
    return {accept, parseJson: true}
  }
  // A range like `2XX` can't be compared with a status, so it isn't guarded.
  const explicit = json.every((response) => /^\d+$/.test(response.code))
  return {
    accept,
    parseJson: explicit ? json.map((response) => Number(response.code)) : true,
  }
}

function getStatusCondition(
  statuses: number[],
  status: string,
  language: "javascript" | "python",
): string {
  if (statuses.length === 1) {
    return `${status} ${language === "javascript" ? "===" : "=="} ${statuses[0]}`
  }
  return language === "javascript"
    ? `[${statuses.join(", ")}].includes(${status})`
    : `${status} in (${statuses.join(", ")})`
}

function toParameterValue(value: unknown): string {
  if (value === undefined || value === null) {
    return ""
  }
  return typeof value === "string" ? value : JSON.stringify(value)
}

/**
 * OpenAPI's default `form` style: arrays and objects repeat their keys when
 * exploded, and are comma-separated otherwise.
 */
function appendQuery(
  query: URLSearchParams,
  name: string,
  value: unknown,
  explode: boolean,
): void {
  if (Array.isArray(value)) {
    if (explode) {
      for (const item of value) {
        query.append(name, toParameterValue(item))
      }
    } else {
      query.append(name, value.map(toParameterValue).join(","))
    }
  } else if (value !== null && typeof value === "object") {
    const entries = Object.entries(value)
    if (explode) {
      for (const [key, item] of entries) {
        query.append(key, toParameterValue(item))
      }
    } else {
      query.append(name, entries.flat().map(toParameterValue).join(","))
    }
  } else {
    query.append(name, toParameterValue(value))
  }
}

/**
 * Path parameters keep their `{name}` placeholder unless the spec gives an
 * example. Only required query and header parameters are included.
 */
function getRequest({
  method,
  parameters,
  path,
  requestBody,
  responses,
  servers,
}: CodeSampleInput): Request {
  let url = getServerUrl(servers[0]) + path
  const query = new URLSearchParams()
  const headers: Record<string, string> = {}

  for (const parameter of parameters) {
    const declared = getDeclaredExample(parameter)
    const example =
      declared !== undefined ? declared : getExample(parameter.schema)
    if (parameter.in === "path" && declared !== undefined) {
      url = url.replaceAll(
        `{${parameter.name}}`,
        encodeURIComponent(toParameterValue(declared)),
      )
    } else if (parameter.required && parameter.in === "query") {
      appendQuery(query, parameter.name, example, parameter.explode ?? true)
    } else if (parameter.required && parameter.in === "header") {
      headers[parameter.name] = toParameterValue(example)
    }
  }
  if (query.size) {
    url += `?${query}`
  }

  const content = requestBody?.content ?? {}
  const contentType = findJsonMediaType(content) ?? Object.keys(content)[0]
  if (contentType) {
    headers["Content-Type"] = contentType
  }
  const media = isJsonMediaType(contentType) ? content[contentType] : null
  const body = media ? getMediaExample(media) : undefined

  const upperMethod = method.toUpperCase()
  const {accept, parseJson} = getResponseHandling(upperMethod, responses)
  if (accept) {
    headers.Accept = accept
  }
  return {body, contentType, headers, method: upperMethod, parseJson, url}
}

function toPython(value: unknown, indent = ""): string {
  if (value === null || value === undefined) {
    return "None"
  }
  if (typeof value === "boolean") {
    return value ? "True" : "False"
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => toPython(item, indent)).join(", ")}]`
  }
  if (typeof value === "object") {
    const inner = `${indent}    `
    const entries = Object.entries(value).map(
      ([key, item]) =>
        `${inner}${JSON.stringify(key)}: ${toPython(item, inner)}`,
    )
    return entries.length ? `{\n${entries.join(",\n")},\n${indent}}` : "{}"
  }
  return JSON.stringify(value)
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`
}

function curl({body, headers, method, url}: Request): string {
  const lines = [`curl -X ${method} ${shellQuote(url)}`]
  for (const [name, value] of Object.entries(headers)) {
    lines.push(`  -H ${shellQuote(`${name}: ${value}`)}`)
  }
  if (body !== undefined) {
    lines.push(`  -d ${shellQuote(JSON.stringify(body, null, 2))}`)
  }
  return lines.join(" \\\n")
}

function javascript({body, headers, method, parseJson, url}: Request): string {
  const options = [`  method: "${method}",`]
  if (Object.keys(headers).length) {
    options.push(`  headers: ${JSON.stringify(headers)},`)
  }
  if (body !== undefined) {
    const json = JSON.stringify(body, null, 2).replaceAll("\n", "\n  ")
    options.push(`  body: JSON.stringify(${json}),`)
  }
  return [
    `const response = await fetch(${JSON.stringify(url)}, {`,
    ...options,
    "})",
    Array.isArray(parseJson)
      ? `const data = ${getStatusCondition(parseJson, "response.status", "javascript")} ? await response.json() : null`
      : parseJson
        ? "const data = await response.json()"
        : "console.log(response.status)",
  ].join("\n")
}

const pythonMethods = [
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "POST",
  "PUT",
]

function python({body, headers, method, parseJson, url}: Request): string {
  const args = [`    ${JSON.stringify(url)},`]
  if (Object.keys(headers).length) {
    args.push(`    headers=${toPython(headers, "    ")},`)
  }
  if (body === null) {
    // `json=None` would send no body at all.
    args.push(`    data="null",`)
  } else if (body !== undefined) {
    args.push(`    json=${toPython(body, "    ")},`)
  }
  const call = pythonMethods.includes(method)
    ? `requests.${method.toLowerCase()}(`
    : `requests.request(\n    "${method}",`
  return [
    "import requests",
    "",
    `response = ${call}`,
    ...args,
    ")",
    Array.isArray(parseJson)
      ? `print(response.json() if ${getStatusCondition(parseJson, "response.status_code", "python")} else response.status_code)`
      : parseJson
        ? "print(response.json())"
        : "print(response.status_code)",
  ].join("\n")
}

export function getCodeSamples(input: CodeSampleInput): CodeSample[] {
  const request = getRequest(input)
  return [
    {code: curl(request), label: "cURL", language: "shell"},
    {code: javascript(request), label: "JavaScript", language: "typescript"},
    {code: python(request), label: "Python", language: "text"},
  ]
}
