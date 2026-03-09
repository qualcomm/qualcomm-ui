// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {formatNpmInstallTabs} from "../markdown/knowledge/plugins"

async function processContent(content: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(formatNpmInstallTabs)
    .use(remarkStringify)

  const result = await processor.process(content)
  return String(result).trim()
}

describe("formatNpmInstallTabs", () => {
  test("transforms single package", async () => {
    const input = `<NpmInstallTabs packages={["react"]} />`
    const result = await processContent(input)
    expect(result).toBe("```shell\nnpm install react\n```")
  })

  test("transforms multiple packages", async () => {
    const input = `<NpmInstallTabs packages={["react", "react-dom", "typescript"]} />`
    const result = await processContent(input)
    expect(result).toBe("```shell\nnpm install react react-dom typescript\n```")
  })

  test("removes element when packages array is empty", async () => {
    const input = `<NpmInstallTabs packages={[]} />`
    const result = await processContent(input)
    expect(result).toBe("")
  })

  test("removes element when packages attribute is missing", async () => {
    const input = `<NpmInstallTabs />`
    const result = await processContent(input)
    expect(result).toBe("")
  })

  test("preserves other JSX elements", async () => {
    const input = `<Button>Click me</Button>

<NpmInstallTabs packages={["lodash"]} />

<Text>Some text</Text>`
    const result = await processContent(input)
    expect(result).toContain("<Button>Click me</Button>")
    expect(result).toContain("```shell\nnpm install lodash\n```")
    expect(result).toContain("<Text>Some text</Text>")
  })

  test("handles multiple NpmInstallTabs", async () => {
    const input = `## Install dependencies

<NpmInstallTabs packages={["package-a"]} />

## Dev dependencies

<NpmInstallTabs packages={["vitest", "typescript"]} />`

    const result = await processContent(input)
    expect(result).toContain("npm install package-a")
    expect(result).toContain("npm install vitest typescript")
  })

  test("preserves surrounding markdown", async () => {
    const input = `# Getting Started

First, install the package:

<NpmInstallTabs packages={["@qualcomm-ui/react"]} />

Then import it in your code.`

    const result = await processContent(input)
    expect(result).toContain("# Getting Started")
    expect(result).toContain("First, install the package:")
    expect(result).toContain("npm install @qualcomm-ui/react")
    expect(result).toContain("Then import it in your code.")
  })

  test("handles scoped packages", async () => {
    const input = `<NpmInstallTabs packages={["@scope/package", "@other/lib"]} />`
    const result = await processContent(input)
    expect(result).toBe("```shell\nnpm install @scope/package @other/lib\n```")
  })

  test("handles packages with version specifiers", async () => {
    const input = `<NpmInstallTabs packages={["react@18.2.0", "typescript@^5.0.0"]} />`
    const result = await processContent(input)
    expect(result).toBe(
      "```shell\nnpm install react@18.2.0 typescript@^5.0.0\n```",
    )
  })
})
