// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {
  getOpenApiModuleCode,
  getOperationModuleCode,
} from "../open-api/get-module-code.js"

interface LoaderArgs {
  params: Record<string, string | undefined>
  pattern: string
}

function toDataUrl(code: string): string {
  return `data:text/javascript,${encodeURIComponent(code)}`
}

async function getLoader(operations: Record<string, unknown>) {
  const code = getOpenApiModuleCode(Object.keys(operations), (pathname) =>
    toDataUrl(getOperationModuleCode(operations[pathname])),
  )
  const module = (await import(/* @vite-ignore */ toDataUrl(code))) as {
    loader: (args: LoaderArgs) => Promise<unknown>
  }
  return (pattern: string, splat: string) =>
    module.loader({params: {"*": splat}, pattern})
}

describe("getOpenApiModuleCode", () => {
  test("finds the operation from the route pattern and splat", async () => {
    const loader = await getLoader({
      "/api/getMetadata": {slug: "getMetadata"},
      "/api/users-{id}:activate-post": {slug: "users-{id}:activate-post"},
    })
    expect(await loader("/api/*", "getMetadata")).toEqual({
      slug: "getMetadata",
    })
    expect(await loader("/api/*", "getMetadata/")).toEqual({
      slug: "getMetadata",
    })
    expect(await loader("api/*", "getMetadata")).toEqual({slug: "getMetadata"})
    expect(await loader("/api/*", "users-{id}:activate-post")).toEqual({
      slug: "users-{id}:activate-post",
    })
  })

  test("responds with a 404 for unknown operations", async () => {
    const loader = await getLoader({"/api/getMetadata": {}})
    for (const splat of ["nope", "constructor", "__proto__"]) {
      const response = (await loader("/api/*", splat)) as Response
      expect(response.status).toBe(404)
      expect(await response.json()).toBeNull()
    }
  })
})

describe("getOperationModuleCode", () => {
  test("exports the operation", async () => {
    const operation = {description: 'Quotes " and\nnewlines', slug: "a"}
    const module = (await import(
      /* @vite-ignore */ toDataUrl(getOperationModuleCode(operation))
    )) as {default: unknown}
    expect(module.default).toEqual(operation)
  })
})
