// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {createServer, type Server} from "node:http"
import type {AddressInfo} from "node:net"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterAll, beforeAll, describe, expect, test} from "vitest"

import {loadOpenApiSpec} from "../open-api/load-spec.js"
import {prefetchRemoteSpecs} from "../open-api/remote-specs.js"

const spec = {
  info: {title: "Remote", version: "1.0.0"},
  openapi: "3.1.0",
  paths: {},
}

describe("remote OpenAPI specs", () => {
  let directory: string
  let origin: string
  let server: Server
  const requests: string[] = []

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), "qui-openapi-"))
    server = createServer((req, res) => {
      requests.push(req.url ?? "")
      if (req.url === "/missing.json") {
        res.writeHead(404).end()
        return
      }
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify(spec))
    })
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  })

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve))
    await rm(directory, {force: true, recursive: true})
  })

  async function writeMdx(name: string, specPath: string): Promise<string> {
    const file = join(directory, name)
    await writeFile(
      file,
      `---\ntitle: API\nopenApi: ${specPath}\n---\n\n# API\n`,
    )
    return file
  }

  test("loads a prefetched spec and fetches it only once", async () => {
    const url = `${origin}/cached.json`
    const file = await writeMdx("cached.mdx", url)

    await prefetchRemoteSpecs([file])
    await prefetchRemoteSpecs([file])

    expect(requests.filter((path) => path === "/cached.json")).toHaveLength(1)
    expect(loadOpenApiSpec(file, url)).toMatchObject({info: spec.info})
  })

  test("rejects when the server responds with an error", async () => {
    const file = await writeMdx("missing.mdx", `${origin}/missing.json`)

    await expect(prefetchRemoteSpecs([file])).rejects.toThrow(
      `Failed to fetch OpenAPI spec ${origin}/missing.json: 404`,
    )
  })

  test("skips MDX files that vanished since they were listed", async () => {
    await expect(
      prefetchRemoteSpecs([join(directory, "deleted.mdx")]),
    ).resolves.toBeUndefined()
  })

  test("throws when loading a spec that wasn't prefetched", async () => {
    const url = `${origin}/not-prefetched.json`
    const file = await writeMdx("not-prefetched.mdx", url)

    expect(() => loadOpenApiSpec(file, url)).toThrow(
      `OpenAPI spec was not prefetched: ${url}`,
    )
  })
})
