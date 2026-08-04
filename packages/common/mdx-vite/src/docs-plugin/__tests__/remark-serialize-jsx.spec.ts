// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {remarkSerializeJsxKnowledge, remarkSerializeJsxRender} from "../remark"

async function processRender(mdx: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkSerializeJsxRender)
    .use(remarkStringify)
    .process(mdx)
  return String(result)
}

async function processKnowledge(mdx: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkSerializeJsxKnowledge)
    .use(remarkStringify)
    .process(mdx)
  return String(result)
}

const BLOCK = `::: serialize-jsx

The demo shows reordering by position in the \`children\` array.

<NestedRouteOrderDemo />

:::`

describe("remarkSerializeJsxRender", () => {
  test("keeps JSX, removes prose and markers", async () => {
    const result = await processRender(BLOCK)
    expect(result).toContain("<NestedRouteOrderDemo />")
    expect(result).not.toContain("::: serialize-jsx")
    expect(result).not.toContain("The demo shows reordering")
  })

  test("preserves surrounding content", async () => {
    const input = `## Heading\n\n${BLOCK}\n\nAfter block.`
    const result = await processRender(input)
    expect(result).toContain("## Heading")
    expect(result).toContain("After block.")
    expect(result).toContain("<NestedRouteOrderDemo />")
  })

  test("handles a prose-only block (no JSX child)", async () => {
    const input = `::: serialize-jsx\n\nOnly prose here.\n\n:::`
    const result = await processRender(input)
    expect(result).not.toContain("Only prose here.")
    expect(result).not.toContain("::: serialize-jsx")
  })

  test("handles a JSX-only block (no prose child)", async () => {
    const input = `::: serialize-jsx\n\n<SomeDemo />\n\n:::`
    const result = await processRender(input)
    expect(result).toContain("<SomeDemo />")
    expect(result).not.toContain("::: serialize-jsx")
  })

  test("leaves an unclosed block untouched", async () => {
    const input = `::: serialize-jsx\n\nMissing closing marker.\n\n<SomeDemo />`
    const result = await processRender(input)
    expect(result).toContain("::: serialize-jsx")
    expect(result).toContain("Missing closing marker.")
  })

  test("handles multiple blocks in one document", async () => {
    const second = `::: serialize-jsx\n\nSecond prose.\n\n<AnotherDemo />\n\n:::`
    const input = `${BLOCK}\n\n${second}`
    const result = await processRender(input)
    expect(result).toContain("<NestedRouteOrderDemo />")
    expect(result).toContain("<AnotherDemo />")
    expect(result).not.toContain("The demo shows reordering")
    expect(result).not.toContain("Second prose.")
  })
})

describe("remarkSerializeJsxKnowledge", () => {
  test("keeps prose, removes JSX and markers", async () => {
    const result = await processKnowledge(BLOCK)
    expect(result).toContain("The demo shows reordering")
    expect(result).not.toContain("<NestedRouteOrderDemo />")
    expect(result).not.toContain("::: serialize-jsx")
  })

  test("preserves surrounding content", async () => {
    const input = `## Heading\n\n${BLOCK}\n\nAfter block.`
    const result = await processKnowledge(input)
    expect(result).toContain("## Heading")
    expect(result).toContain("After block.")
    expect(result).toContain("The demo shows reordering")
  })

  test("handles a prose-only block (no JSX child)", async () => {
    const input = `::: serialize-jsx\n\nOnly prose here.\n\n:::`
    const result = await processKnowledge(input)
    expect(result).toContain("Only prose here.")
    expect(result).not.toContain("::: serialize-jsx")
  })

  test("handles a JSX-only block (no prose child)", async () => {
    const input = `::: serialize-jsx\n\n<SomeDemo />\n\n:::`
    const result = await processKnowledge(input)
    expect(result).not.toContain("<SomeDemo />")
    expect(result).not.toContain("::: serialize-jsx")
  })

  test("leaves an unclosed block untouched", async () => {
    const input = `::: serialize-jsx\n\nMissing closing marker.\n\n<SomeDemo />`
    const result = await processKnowledge(input)
    expect(result).toContain("::: serialize-jsx")
    expect(result).toContain("Missing closing marker.")
  })

  test("handles multiple blocks in one document", async () => {
    const second = `::: serialize-jsx\n\nSecond prose.\n\n<AnotherDemo />\n\n:::`
    const input = `${BLOCK}\n\n${second}`
    const result = await processKnowledge(input)
    expect(result).toContain("The demo shows reordering")
    expect(result).toContain("Second prose.")
    expect(result).not.toContain("<NestedRouteOrderDemo />")
    expect(result).not.toContain("<AnotherDemo />")
  })
})
