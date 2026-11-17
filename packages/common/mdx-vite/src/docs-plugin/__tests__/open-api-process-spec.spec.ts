// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterAll, beforeAll, describe, expect, test} from "vitest"

import {processOpenApiSpec} from "../open-api/process-spec.js"

function spec(summary: string) {
  return JSON.stringify({
    info: {title: "Pets", version: "1.0.0"},
    openapi: "3.1.0",
    paths: {"/pets": {get: {description: "Lists **pets**.", summary}}},
  })
}

describe("processOpenApiSpec", () => {
  let directory: string

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), "qui-openapi-process-"))
  })

  afterAll(async () => {
    await rm(directory, {force: true, recursive: true})
  })

  test("reuses the result until the spec file changes", async () => {
    await writeFile(join(directory, "pets.json"), spec("List pets"))
    const first = processOpenApiSpec(join(directory, "pets.json"))
    expect(processOpenApiSpec(join(directory, "pets.json"))).toBe(first)
    expect(first.operations[0]).toMatchObject({
      markdown: "Lists **pets**.",
      searchText: "Lists pets.",
    })

    await writeFile(join(directory, "pets.json"), spec("List all the pets"))
    const second = processOpenApiSpec(join(directory, "pets.json"))
    expect(second).not.toBe(first)
    expect(second.operations[0].details.summary).toBe("List all the pets")
  })

  test("doesn't cache a spec that failed to load", async () => {
    await writeFile(join(directory, "broken.json"), "{")
    expect(() => processOpenApiSpec(join(directory, "broken.json"))).toThrow()

    await writeFile(join(directory, "broken.json"), spec("Fixed"))
    expect(
      processOpenApiSpec(join(directory, "broken.json")).operations[0].details
        .summary,
    ).toBe("Fixed")
  })
})
