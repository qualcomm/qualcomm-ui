// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getOperations} from "../open-api/get-operations.js"

describe("getOperations", () => {
  test("uses operationId verbatim as the slug", () => {
    const operations = getOperations({
      paths: {
        "/pet/{petId}": {
          get: {operationId: "getPetById", summary: "Find pet", tags: ["pet"]},
        },
      },
    })
    expect(operations).toEqual([
      {
        method: "get",
        path: "/pet/{petId}",
        slug: "getPetById",
        summary: "Find pet",
        tags: ["pet"],
      },
    ])
  })

  test("derives the slug from path and method without operationId", () => {
    const [operation] = getOperations({
      paths: {"/planets/{planetId}/image.png": {post: {}}},
    })
    expect(operation.slug).toBe("planets-planetid-image-png-post")
  })

  test("lists every method of a path and ignores non-method keys", () => {
    const operations = getOperations({
      paths: {
        "/pets": {
          get: {operationId: "listPets"},
          parameters: [],
          post: {operationId: "createPet"},
        } as never,
      },
    })
    expect(operations.map((op) => op.slug)).toEqual(["listPets", "createPet"])
  })

  test("lists operations of a path item that is a ref", () => {
    const operations = getOperations({
      components: {pathItems: {Pets: {get: {operationId: "listPets"}}}},
      paths: {"/pets": {$ref: "#/components/pathItems/Pets"}},
    } as never)
    expect(operations.map((op) => [op.slug, op.path])).toEqual([
      ["listPets", "/pets"],
    ])
  })

  test("follows path item ref chains and stops on cycles", () => {
    const operations = getOperations({
      components: {
        pathItems: {
          A: {$ref: "#/components/pathItems/B"},
          Alias: {$ref: "#/components/pathItems/Pets"},
          B: {$ref: "#/components/pathItems/A"},
          Pets: {get: {operationId: "listPets"}},
        },
      },
      paths: {
        "/loop": {$ref: "#/components/pathItems/A"},
        "/pets": {$ref: "#/components/pathItems/Alias"},
      },
    } as never)
    expect(operations.map((op) => op.slug)).toEqual(["listPets"])
  })

  test("defaults tags to an empty array", () => {
    const [operation] = getOperations({paths: {"/me": {get: {}}}})
    expect(operation.tags).toEqual([])
  })

  test("throws when two operations share a slug", () => {
    expect(() =>
      getOperations({
        paths: {
          "/a": {get: {operationId: "planets-planetid-get"}},
          "/planets/{planetId}": {get: {}},
        },
      }),
    ).toThrow(/Duplicate OpenAPI operation slug "planets-planetid-get"/)
  })

  test("returns nothing for a document without paths", () => {
    expect(getOperations({})).toEqual([])
  })
})
