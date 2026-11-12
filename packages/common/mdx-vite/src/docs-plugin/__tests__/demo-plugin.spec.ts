// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root, RootContent} from "mdast"
import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import {unified} from "unified"
import {afterEach, describe, expect, test} from "vitest"

import {formatDemos} from "../markdown/knowledge/plugins"

let demosFolder: string | undefined

afterEach(async () => {
  if (demosFolder) {
    await rm(demosFolder, {force: true, recursive: true})
    demosFolder = undefined
  }
})

async function writeDemos(files: Record<string, string>): Promise<string> {
  demosFolder = await mkdtemp(join(tmpdir(), "qui-demo-plugin-"))
  await Promise.all(
    Object.entries(files).map(([name, contents]) =>
      writeFile(join(demosFolder!, name), contents, "utf-8"),
    ),
  )
  return demosFolder
}

function summarize(node: RootContent): string {
  switch (node.type) {
    case "code":
      return `code:${node.value.split("\n")[0]}`
    case "heading":
      return `heading:${node.children.map((child) => ("value" in child ? child.value : "")).join("")}`
    default:
      return node.type
  }
}

async function run(content: string, folder: string): Promise<string[]> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(formatDemos(folder))
  const tree = (await processor.run(processor.parse(content))) as Root
  return tree.children.map(summarize)
}

describe("formatDemos", () => {
  test("keeps sibling nodes in place when demos with imports resolve out of order", async () => {
    const slowChain = Array.from({length: 8}, (_, i) => i + 1)
    const folder = await writeDemos({
      "fast-demo.tsx": 'import {fast} from "./fast-helper"\n',
      "fast-helper.ts": "export const fast = 1\n",
      "slow-demo.tsx": 'import {slow} from "./slow-1"\n',
      ...Object.fromEntries(
        slowChain.map((i) => [
          `slow-${i}.ts`,
          i < slowChain.length
            ? `import {slow} from "./slow-${i + 1}"\n`
            : "export const slow = 1\n",
        ]),
      ),
    })

    const result = await run(
      [
        '<Demo name="FastDemo" />',
        "## Between",
        '<Demo name="SlowDemo" />',
        "## After",
      ].join("\n\n"),
      folder,
    )

    expect(result).toEqual([
      'code:import {fast} from "./fast-helper"',
      "code:export const fast = 1",
      "heading:Between",
      'code:import {slow} from "./slow-1"',
      ...slowChain.map((i) =>
        i < slowChain.length
          ? `code:import {slow} from "./slow-${i + 1}"`
          : "code:export const slow = 1",
      ),
      "heading:After",
    ])
  })

  test("replaces a demo that directly follows a removed demo", async () => {
    const folder = await writeDemos({
      "basic-demo.tsx": "export function BasicDemo() {}\n",
    })

    const result = await run(
      ["<Demo />", '<Demo name="BasicDemo" />'].join("\n"),
      folder,
    )

    expect(result).toEqual(["code:export function BasicDemo() {}"])
  })
})
