// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterAll, beforeAll, describe, expect, test} from "vitest"

import {withOpenApiRoutes} from "../open-api/with-open-api-routes.js"

describe("withOpenApiRoutes", () => {
  let appDirectory: string
  const operationPage = "/site/openapi-route.tsx"

  beforeAll(async () => {
    appDirectory = await mkdtemp(join(tmpdir(), "qui-openapi-routes-"))
    await writeFile(
      join(appDirectory, "api.mdx"),
      "---\nopenApi: ./spec.json\n---\n",
    )
    await writeFile(join(appDirectory, "guide.mdx"), "---\ntitle: Guide\n---\n")
  })

  afterAll(async () => {
    await rm(appDirectory, {force: true, recursive: true})
  })

  test("adds an operation route next to each API page", async () => {
    const routes = await withOpenApiRoutes(
      [
        {file: "api.mdx", id: "api", path: "api"},
        {file: "guide.mdx", id: "guide", path: "guide"},
      ],
      {appDirectory, operationPage},
    )
    expect(routes).toEqual([
      {file: "api.mdx", id: "api", path: "api"},
      {file: operationPage, id: "api/openapi", path: "api/*"},
      {file: "guide.mdx", id: "guide", path: "guide"},
    ])
  })

  test("nests the operation route of an index page under its parent", async () => {
    const [layout] = await withOpenApiRoutes(
      [
        {
          children: [{file: "api.mdx", id: "api", index: true}],
          file: "layout.tsx",
          path: "reference",
        },
      ],
      {appDirectory, operationPage},
    )
    expect(layout.children?.[1]).toEqual({
      file: operationPage,
      id: "api/openapi",
      path: "*",
    })
  })

  test("rejects an API page at the site root", async () => {
    await expect(
      withOpenApiRoutes(
        [
          {
            children: [{file: "api.mdx", id: "api", index: true}],
            file: "root-layout.tsx",
          },
        ],
        {appDirectory, operationPage},
      ),
    ).rejects.toThrow("the site's root page can't be an OpenAPI page")
  })
})
