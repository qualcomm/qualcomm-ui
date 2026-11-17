// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getOpenApiModuleCode} from "../open-api/get-module-code.js"

interface LoaderArgs {
  params: Record<string, string | undefined>
  pattern: string
}

async function getLoader(operations: Record<string, unknown>) {
  const code = getOpenApiModuleCode(operations)
  const module = (await import(
    /* @vite-ignore */ `data:text/javascript,${encodeURIComponent(code)}`
  )) as {loader: (args: LoaderArgs) => unknown}
  return (pattern: string, splat: string) =>
    module.loader({params: {"*": splat}, pattern})
}

describe("getOpenApiModuleCode", () => {
  test("finds the operation from the route pattern and splat", async () => {
    const loader = await getLoader({
      "/api/getMetadata": {slug: "getMetadata"},
      "/api/users-{id}:activate-post": {slug: "users-{id}:activate-post"},
    })
    expect(loader("/api/*", "getMetadata")).toEqual({slug: "getMetadata"})
    expect(loader("/api/*", "getMetadata/")).toEqual({slug: "getMetadata"})
    expect(loader("api/*", "getMetadata")).toEqual({slug: "getMetadata"})
    expect(loader("/api/*", "users-{id}:activate-post")).toEqual({
      slug: "users-{id}:activate-post",
    })
  })

  test("responds with a 404 for unknown operations", async () => {
    const loader = await getLoader({"/api/getMetadata": {}})
    for (const response of [
      loader("/api/*", "nope"),
      loader("/other/*", "getMetadata"),
    ] as Response[]) {
      expect(response.status).toBe(404)
      expect(await response.json()).toBeNull()
    }
  })
})
