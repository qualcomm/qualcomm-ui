// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getOperationDetails} from "../open-api/get-operation-details.js"
import {getOperations} from "../open-api/get-operations.js"

const document = {
  components: {
    parameters: {PetId: {in: "path", name: "petId", required: true}},
  },
  paths: {
    "/pet/{petId}": {
      get: {
        description: "Returns a single pet.",
        operationId: "getPetById",
        parameters: [{in: "query", name: "expand"}],
      },
      parameters: [{$ref: "#/components/parameters/PetId"}],
      put: {
        operationId: "updatePet",
        parameters: [{description: "Own", in: "path", name: "petId"}],
        servers: [{url: "https://write.example.com"}],
      },
    },
  },
  servers: [{url: "https://api.example.com"}],
}

function details(slug: string) {
  const operation = getOperations(document).find((op) => op.slug === slug)!
  return getOperationDetails(document, operation)
}

describe("getOperationDetails", () => {
  test("keeps the operation fields and the spec fields", () => {
    expect(details("getPetById")).toMatchObject({
      description: "Returns a single pet.",
      method: "get",
      path: "/pet/{petId}",
      slug: "getPetById",
    })
  })

  test("prepends path-level parameters, with refs inlined", () => {
    expect(details("getPetById").parameters).toEqual([
      {in: "path", name: "petId", required: true},
      {in: "query", name: "expand"},
    ])
  })

  test("lets an operation parameter override the path-level one", () => {
    expect(details("updatePet").parameters).toEqual([
      {description: "Own", in: "path", name: "petId"},
    ])
  })

  test("uses the closest servers declaration", () => {
    expect(details("getPetById").servers).toEqual([
      {url: "https://api.example.com"},
    ])
    expect(details("updatePet").servers).toEqual([
      {url: "https://write.example.com"},
    ])
  })
})
