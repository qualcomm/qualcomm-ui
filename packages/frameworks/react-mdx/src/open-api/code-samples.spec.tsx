// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {type CodeSampleInput, getCodeSamples} from "./code-samples.js"

const createPet: CodeSampleInput = {
  method: "post",
  parameters: [
    {in: "path", name: "storeId", required: true, schema: {type: "integer"}},
    {example: "abc", in: "header", name: "api_key", required: true},
    {in: "query", name: "dryRun", required: true, schema: {type: "boolean"}},
    {in: "query", name: "verbose", schema: {type: "boolean"}},
  ],
  path: "/stores/{storeId}/pets",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          properties: {name: {example: "Rex's toy", type: "string"}},
          type: "object",
        },
      },
    },
  },
  servers: [{url: "https://api.example.com/v1/"}],
}

function sample(input: CodeSampleInput, label: string) {
  return getCodeSamples(input).find((s) => s.label === label)!.code
}

describe("getCodeSamples", () => {
  test("builds a curl command with required params and a JSON body", () => {
    expect(sample(createPet, "cURL")).toBe(
      [
        "curl -X POST 'https://api.example.com/v1/stores/{storeId}/pets?dryRun=true' \\",
        "  -H 'api_key: abc' \\",
        "  -H 'Content-Type: application/json' \\",
        `  -d '{\n  "name": "Rex'\\''s toy"\n}'`,
      ].join("\n"),
    )
  })

  test("builds a fetch call", () => {
    expect(sample(createPet, "JavaScript")).toBe(
      [
        'const response = await fetch("https://api.example.com/v1/stores/{storeId}/pets?dryRun=true", {',
        '  method: "POST",',
        '  headers: {"api_key":"abc","Content-Type":"application/json"},',
        '  body: JSON.stringify({\n    "name": "Rex\'s toy"\n  }),',
        "})",
        "const data = await response.json()",
      ].join("\n"),
    )
  })

  test("builds a requests call with Python literals", () => {
    const code = sample(
      {
        ...createPet,
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {done: {type: "boolean"}, tag: {type: "null"}},
                type: "object",
              },
            },
          },
        },
      },
      "Python",
    )
    expect(code).toContain("response = requests.post(")
    expect(code).toContain('"done": True')
    expect(code).toContain('"tag": None')
  })

  test("substitutes path parameters that have an example", () => {
    const code = sample(
      {
        method: "get",
        parameters: [{example: 42, in: "path", name: "id", required: true}],
        path: "/pets/{id}",
        servers: [],
      },
      "cURL",
    )
    expect(code).toBe("curl -X GET 'https://api.example.com/pets/42'")
  })

  test("encodes path parameter examples, wherever they repeat", () => {
    const code = sample(
      {
        method: "get",
        parameters: [
          {example: "a b/c", in: "path", name: "id", required: true},
        ],
        path: "/files/{id}/copies/{id}",
        servers: [],
      },
      "cURL",
    )
    expect(code).toBe(
      "curl -X GET 'https://api.example.com/files/a%20b%2Fc/copies/a%20b%2Fc'",
    )
  })

  test("fills server variables with their defaults", () => {
    const code = sample(
      {
        method: "get",
        parameters: [],
        path: "/pets",
        servers: [
          {
            url: "https://{region}.example.com/{version}",
            variables: {region: {default: "eu"}, version: {default: "v2"}},
          },
        ],
      },
      "cURL",
    )
    expect(code).toBe("curl -X GET 'https://eu.example.com/v2/pets'")
  })

  test("quotes every shell argument", () => {
    const code = sample(
      {
        method: "get",
        parameters: [
          {example: "O'Reilly", in: "header", name: "X-Owner", required: true},
        ],
        path: "/books",
        servers: [],
      },
      "cURL",
    )
    expect(code).toContain(`-H 'X-Owner: O'\\''Reilly'`)
  })

  test("repeats exploded array query parameters", () => {
    const input = (explode?: boolean): CodeSampleInput => ({
      method: "get",
      parameters: [
        {
          example: ["a", "b"],
          explode,
          in: "query",
          name: "tags",
          required: true,
        },
      ],
      path: "/pets",
      servers: [],
    })
    expect(sample(input(), "cURL")).toContain("/pets?tags=a&tags=b'")
    expect(sample(input(false), "cURL")).toContain("/pets?tags=a%2Cb'")
  })

  test("prefers the media type's own example for the body", () => {
    const code = sample(
      {
        method: "post",
        parameters: [],
        path: "/pets",
        requestBody: {
          content: {
            "application/json": {
              examples: {rex: {value: {name: "Rex"}}},
              schema: {properties: {name: {type: "string"}}, type: "object"},
            },
          },
        },
        servers: [],
      },
      "JavaScript",
    )
    expect(code).toContain('"name": "Rex"')
  })

  test("keeps null examples", () => {
    const body = (media: object): CodeSampleInput => ({
      method: "put",
      parameters: [],
      path: "/note",
      requestBody: {
        content: {
          "application/json": {...media, schema: {type: ["string", "null"]}},
        },
      },
      servers: [],
    })
    expect(sample(body({example: null}), "cURL")).toContain("-d 'null'")
    expect(
      sample(body({examples: {clear: {value: null}}}), "Python"),
    ).toContain('data="null"')
  })

  test("falls back to requests.request for uncommon methods", () => {
    const code = sample(
      {method: "trace", parameters: [], path: "/", servers: []},
      "Python",
    )
    expect(code).toContain('requests.request(\n    "TRACE",')
  })
})
