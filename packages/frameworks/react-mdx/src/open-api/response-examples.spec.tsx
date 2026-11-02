// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getResponseExamples} from "./response-examples.js"

describe("getResponseExamples", () => {
  test("uses the declared JSON example, or generates one", () => {
    expect(
      getResponseExamples({
        200: {
          content: {
            "application/json": {
              schema: {properties: {id: {type: "integer"}}, type: "object"},
            },
          },
        },
        404: {
          content: {
            "application/json": {examples: {missing: {value: {error: "nope"}}}},
          },
        },
      }),
    ).toEqual([
      {code: "200", example: {id: 0}, mediaType: "application/json"},
      {code: "404", example: {error: "nope"}, mediaType: "application/json"},
    ])
  })

  test("generates examples for JSON variants", () => {
    expect(
      getResponseExamples({
        200: {
          content: {
            "application/json; charset=utf-8": {schema: {type: "boolean"}},
            "text/plain": {example: "ok"},
          },
        },
        400: {
          content: {
            "application/problem+json": {
              schema: {properties: {title: {type: "string"}}, type: "object"},
            },
          },
        },
      }),
    ).toEqual([
      {
        code: "200",
        example: true,
        mediaType: "application/json; charset=utf-8",
      },
      {
        code: "400",
        example: {title: "string"},
        mediaType: "application/problem+json",
      },
    ])
  })

  test("only shows declared examples for other media types", () => {
    expect(
      getResponseExamples({
        200: {content: {"text/plain": {example: "pong"}}},
        201: {content: {"application/xml": {schema: {type: "object"}}}},
      }),
    ).toEqual([
      {code: "200", example: "pong", mediaType: "text/plain"},
      {code: "201", example: undefined, mediaType: "application/xml"},
    ])
  })

  test("has no example for responses without a body", () => {
    expect(
      getResponseExamples({204: {description: "Deleted"} as never}),
    ).toEqual([{code: "204", example: undefined, mediaType: undefined}])
  })
})
