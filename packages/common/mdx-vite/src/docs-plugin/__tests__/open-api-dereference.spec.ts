// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {dereference} from "../open-api/dereference.js"

const pet = {properties: {name: {type: "string"}}, type: "object"}

describe("dereference", () => {
  test("inlines a local ref", () => {
    const document = {components: {schemas: {Pet: pet}}}
    expect(
      dereference({schema: {$ref: "#/components/schemas/Pet"}}, document),
    ).toEqual({schema: {...pet, title: "Pet"}})
  })

  test("inlines refs found inside the target", () => {
    const document = {
      components: {
        schemas: {
          Pet: {properties: {tag: {$ref: "#/components/schemas/Tag"}}},
          Tag: {type: "string"},
        },
      },
    }
    expect(dereference({$ref: "#/components/schemas/Pet"}, document)).toEqual({
      properties: {tag: {title: "Tag", type: "string"}},
      title: "Pet",
    })
  })

  test("lets keys next to the ref override the target", () => {
    const document = {components: {schemas: {Pet: pet}}}
    expect(
      dereference(
        {$ref: "#/components/schemas/Pet", description: "A pet"},
        document,
      ),
    ).toEqual({...pet, description: "A pet", title: "Pet"})
  })

  test("marks a ref back to an ancestor as circular", () => {
    const document = {
      components: {
        schemas: {
          Category: {
            properties: {parent: {$ref: "#/components/schemas/Category"}},
          },
        },
      },
    }
    expect(
      dereference({$ref: "#/components/schemas/Category"}, document),
    ).toEqual({
      properties: {
        parent: {$ref: "#/components/schemas/Category", circular: true},
      },
      title: "Category",
    })
  })

  test("inlines the same schema twice when it is not a cycle", () => {
    const document = {components: {schemas: {Pet: pet}}}
    const ref = {$ref: "#/components/schemas/Pet"}
    const titled = {...pet, title: "Pet"}
    expect(dereference({a: ref, b: ref}, document)).toEqual({
      a: titled,
      b: titled,
    })
  })

  test("keeps a schema's own title over its component name", () => {
    const document = {components: {schemas: {Pet: {...pet, title: "A pet"}}}}
    expect(
      dereference({$ref: "#/components/schemas/Pet"}, document),
    ).toMatchObject({title: "A pet"})
  })

  test("decodes escaped pointer segments", () => {
    const document = {paths: {"/pets": {get: {summary: "List"}}}}
    expect(dereference({$ref: "#/paths/~1pets/get"}, document)).toEqual({
      summary: "List",
    })
  })

  test("leaves external and unknown refs untouched", () => {
    const external = {$ref: "./other.json#/Pet"}
    const unknown = {$ref: "#/components/schemas/Missing"}
    expect(dereference({external, unknown}, {})).toEqual({external, unknown})
  })

  test("leaves refs inside example data as written", () => {
    const document = {components: {schemas: {Pet: pet}}}
    const ref = {$ref: "#/components/schemas/Pet"}
    const media = {
      example: {pet: ref},
      examples: {default: {value: {pet: ref}}},
      schema: {default: ref, enum: [ref], examples: [ref]},
    }
    expect(dereference(media, document)).toEqual(media)
  })

  test("inlines named examples and fields named like data keywords", () => {
    const document = {
      components: {
        examples: {Rex: {value: {name: "Rex"}}},
        schemas: {Pet: pet},
      },
    }
    expect(
      dereference(
        {
          examples: {rex: {$ref: "#/components/examples/Rex"}},
          schema: {properties: {example: {$ref: "#/components/schemas/Pet"}}},
        },
        document,
      ),
    ).toEqual({
      examples: {rex: {value: {name: "Rex"}}},
      schema: {properties: {example: {...pet, title: "Pet"}}},
    })
  })
})
