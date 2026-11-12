// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import {unified} from "unified"
import {afterEach, describe, expect, test} from "vitest"

import {PropFormatter} from "../markdown/knowledge/plugins"
import type {DocProps} from "../markdown/knowledge/types"

let directory: string | undefined

afterEach(async () => {
  if (directory) {
    await rm(directory, {force: true, recursive: true})
    directory = undefined
  }
})

async function createFormatter(docProps: DocProps): Promise<PropFormatter> {
  directory = await mkdtemp(join(tmpdir(), "qui-doc-props-plugin-"))
  const docPropsPath = join(directory, "doc-props.json")
  await writeFile(docPropsPath, JSON.stringify(docProps), "utf-8")
  const formatter = new PropFormatter({docPropsPath, routeDir: directory})
  await formatter.loadDocProps()
  return formatter
}

async function run(content: string, formatter: PropFormatter): Promise<Root> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(formatter.propsToMarkdownList())
  return (await processor.run(processor.parse(content))) as Root
}

describe("PropFormatter.propsToMarkdownList", () => {
  test("formats props that directly follow a removed element", async () => {
    const formatter = await createFormatter({
      props: {
        WidgetProps: {
          name: "WidgetProps",
          props: [{name: "size", type: "string"}],
        },
      },
    })

    const tree = await run(
      [
        '<TypeDocProps name="MissingProps" />',
        '<TypeDocProps name="WidgetProps" />',
      ].join("\n"),
      formatter,
    )

    expect(tree.children).toEqual([
      expect.objectContaining({
        type: "code",
        value: expect.stringContaining("size"),
      }),
    ])
  })
})
