// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "hast"
import {toHtml} from "hast-util-to-html"
import {describe, expect, test} from "vitest"

import {parseDescriptions} from "../open-api/parse-descriptions.js"

const html = (tree: unknown) => toHtml(tree as Root)

describe("parseDescriptions", () => {
  test("parses CommonMark descriptions at any depth", () => {
    const parsed = parseDescriptions({
      description: "Ends the upload. `uploadId` is **required**.",
      parameters: [{description: "See [docs](https://example.com)."}],
      responses: {
        "200": {
          content: {
            "application/json": {
              schema: {properties: {id: {description: "- one\n- two"}}},
            },
          },
          description: "A *pet*.",
        },
      },
    })
    expect(html(parsed.description)).toBe(
      "<p>Ends the upload. <code>uploadId</code> is <strong>required</strong>.</p>",
    )
    expect(html(parsed.parameters[0].description)).toBe(
      '<p>See <a href="https://example.com">docs</a>.</p>',
    )
    expect(html(parsed.responses["200"].description)).toBe(
      "<p>A <em>pet</em>.</p>",
    )
    expect(
      html(
        parsed.responses["200"].content["application/json"].schema.properties.id
          .description,
      ),
    ).toBe("<ul>\n<li>one</li>\n<li>two</li>\n</ul>")
  })

  test("drops source positions", () => {
    expect(JSON.stringify(parseDescriptions({description: "*x*"}))).not.toMatch(
      /position/,
    )
  })

  test("leaves example payloads and allowed values untouched", () => {
    const schema = {
      default: {description: "*raw*"},
      enum: [{description: "*raw*"}],
      example: {description: "*raw*"},
      examples: [{description: "*raw*"}],
    }
    expect(parseDescriptions({schema})).toEqual({schema})
  })

  test("parses fields named like data keywords", () => {
    const parsed = parseDescriptions({
      properties: {example: {description: "*x*"}, value: {description: "*y*"}},
    })
    expect(html(parsed.properties.example.description)).toBe(
      "<p><em>x</em></p>",
    )
    expect(html(parsed.properties.value.description)).toBe("<p><em>y</em></p>")
  })

  test("parses the descriptions of a default response and of named examples", () => {
    const parsed = parseDescriptions({
      content: {
        "application/json": {
          examples: {default: {description: "The *usual* case.", value: {}}},
        },
      },
      responses: {default: {description: "Unexpected *error*."}},
    })
    expect(html(parsed.responses.default.description)).toBe(
      "<p>Unexpected <em>error</em>.</p>",
    )
    expect(
      html(parsed.content["application/json"].examples.default.description),
    ).toBe("<p>The <em>usual</em> case.</p>")
  })

  test("drops raw HTML and unsafe URLs", () => {
    const parsed = parseDescriptions({
      description:
        '<script>alert(1)</script> [x](javascript:alert(1)) <img src=x onerror="alert(1)">',
    })
    expect(html(parsed.description)).not.toMatch(
      /script|javascript|onerror|<img/,
    )
  })
})
