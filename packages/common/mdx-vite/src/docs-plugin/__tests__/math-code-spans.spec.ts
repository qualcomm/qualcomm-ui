// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import remarkMath from "remark-math"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {createRemarkProcessor} from "../markdown/remark-pipeline"
import {getRemarkPlugins} from "../mdx-plugins"

const pipelines = [
  {
    create: () =>
      unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(getRemarkPlugins())
        .use(remarkMath),
    name: "page rendering",
  },
  {
    create: () => createRemarkProcessor({mdx: true}),
    name: "knowledge extraction",
  },
]

describe.each(pipelines)("math and code in $name", ({create}) => {
  test.each([
    {
      code: "${SDK_ROOT}",
      source:
        "Environment variables appear preceded by $, for example `${SDK_ROOT}`.",
    },
    {
      code: "${SDK_ROOT}`/bin",
      source: "Use $ with ``${SDK_ROOT}`/bin``.",
    },
    {
      code: "${SDK_ROOT}",
      source: "Use $ with \\``${SDK_ROOT}`.",
    },
    {
      code: "$$a_{n}$$",
      source: "Use $$ with `$$a_{n}$$`.",
    },
  ])("preserves literal code in $source", ({code, source}) => {
    const processor = create()
    const tree = processor.parse(source)

    expect(tree.children).toEqual([
      expect.objectContaining({
        children: [
          expect.objectContaining({type: "text"}),
          expect.objectContaining({type: "inlineCode", value: code}),
          expect.objectContaining({type: "text", value: "."}),
        ],
        type: "paragraph",
      }),
    ])
  })

  test("preserves inline equations alongside code", () => {
    const processor = create()
    const tree = processor.parse("$a_{n} + b$ and `${SDK_ROOT}`.")

    expect(tree.children[0]).toEqual(
      expect.objectContaining({
        children: [
          expect.objectContaining({type: "inlineMath", value: "a_{n} + b"}),
          expect.objectContaining({type: "text", value: " and "}),
          expect.objectContaining({type: "inlineCode", value: "${SDK_ROOT}"}),
          expect.objectContaining({type: "text", value: "."}),
        ],
      }),
    )
  })

  test("preserves unmatched backticks inside math", () => {
    const tree = create().parse("$x ` y$")

    expect(tree.children[0]).toEqual(
      expect.objectContaining({
        children: [
          expect.objectContaining({type: "inlineMath", value: "x ` y"}),
        ],
      }),
    )
  })

  test("preserves escaped backticks inside math", () => {
    const tree = create().parse("$x \\`y\\` z$")

    expect(tree.children[0]).toEqual(
      expect.objectContaining({
        children: [
          expect.objectContaining({
            type: "inlineMath",
            value: "x \\`y\\` z",
          }),
        ],
      }),
    )
  })

  test("reuses the processor across pages", () => {
    const processor = create()
    processor.parse("$x + 1$")

    expect(processor.parse("Use $ with `${SDK_ROOT}`.").children[0]).toEqual(
      expect.objectContaining({
        children: [
          expect.objectContaining({type: "text", value: "Use $ with "}),
          expect.objectContaining({type: "inlineCode", value: "${SDK_ROOT}"}),
          expect.objectContaining({type: "text", value: "."}),
        ],
      }),
    )
  })

  test("preserves display math and fenced code", () => {
    const tree = create().parse(
      "$$\na_{n} + b\n$$\n\nUse $:\n\n```sh\n${SDK_ROOT}\n```",
    )

    expect(tree.children).toEqual([
      expect.objectContaining({type: "math", value: "a_{n} + b"}),
      expect.objectContaining({type: "paragraph"}),
      expect.objectContaining({
        lang: "sh",
        type: "code",
        value: "${SDK_ROOT}",
      }),
    ])
  })
})

test("does not enable math when a site omits remark-math", () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(getRemarkPlugins())

  expect(processor.parse("$x + 1$").children[0]).toEqual(
    expect.objectContaining({
      children: [expect.objectContaining({type: "text", value: "$x + 1$"})],
    }),
  )
})

test("preserves the site's math options and plugin order", () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkMath, {singleDollarTextMath: false})
    .use(getRemarkPlugins())

  expect(processor.parse("$x$ and $$y$$.").children[0]).toEqual(
    expect.objectContaining({
      children: [
        expect.objectContaining({type: "text", value: "$x$ and "}),
        expect.objectContaining({type: "inlineMath", value: "y"}),
        expect.objectContaining({type: "text", value: "."}),
      ],
    }),
  )
})
