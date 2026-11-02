// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactNode} from "react"

import {getVariants} from "./get-variants.js"
import {mergeAllOf} from "./merge-all-of.js"
import {
  SchemaProperties,
  SchemaProperty,
  SchemaVariants,
} from "./schema-property.js"
import type {JsonSchema} from "./schema-type.js"

export type OpenApiContent = Record<string, {schema?: JsonSchema}>

export interface MediaTypeGroup {
  mediaTypes: string[]
  schema?: JsonSchema
}

const payloadKeys = new Set(["const", "default", "enum", "example", "examples"])

/**
 * `xml` only describes how a schema is serialized as XML, which these tables
 * don't show, so it's left out when comparing schemas. Property names and
 * example data are kept as they are.
 */
function withoutXml(node: unknown, inProperties = false): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => withoutXml(item))
  }
  if (!node || typeof node !== "object") {
    return node
  }
  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => inProperties || key !== "xml")
      .map(([key, value]) => [
        key,
        inProperties
          ? withoutXml(value)
          : payloadKeys.has(key)
            ? value
            : withoutXml(
                value,
                key === "properties" || key === "patternProperties",
              ),
      ]),
  )
}

/**
 * Groups media types that share an identical schema, in spec order.
 */
export function groupMediaTypes(
  content: OpenApiContent = {},
): MediaTypeGroup[] {
  const groups = new Map<string, MediaTypeGroup>()
  for (const [mediaType, {schema}] of Object.entries(content)) {
    const key = JSON.stringify(withoutXml(schema ?? null))
    const group = groups.get(key)
    if (group) {
      group.mediaTypes.push(mediaType)
    } else {
      groups.set(key, {mediaTypes: [mediaType], schema})
    }
  }
  return [...groups.values()]
}

/**
 * The schemas of a request or response body: one block per distinct schema,
 * labelled with every media type that uses it.
 */
export function MediaContent({
  content,
  required,
}: {
  content?: OpenApiContent
  required?: boolean
}): ReactNode {
  const groups = groupMediaTypes(content)
  if (!groups.length) {
    return null
  }

  return (
    <>
      {required ? <p className="mdx">Required.</p> : null}
      {groups.map(({mediaTypes, schema: rawSchema}) => {
        const schema = rawSchema && mergeAllOf(rawSchema)
        const variants = schema && getVariants(schema)
        return (
          <Fragment key={mediaTypes.join()}>
            <p className="mdx">
              {mediaTypes.map((mediaType, index) => (
                <Fragment key={mediaType}>
                  {index ? ", " : null}
                  <code className="qui-docs-code">{mediaType}</code>
                </Fragment>
              ))}
            </p>
            {variants ? (
              <SchemaVariants schema={schema} variants={variants} />
            ) : schema?.properties ? (
              <SchemaProperties schema={schema} />
            ) : (
              <div className="doc-props-list__root">
                <SchemaProperty name="body" schema={schema} />
              </div>
            )}
          </Fragment>
        )
      })}
    </>
  )
}
