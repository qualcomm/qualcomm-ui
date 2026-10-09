// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test} from "vitest"

import {KnowledgeExporter} from "../markdown/knowledge/knowledge-exporter"
import {MdxFileReader} from "../markdown/markdown-file-reader"
import {SearchIndexer} from "../search-indexer"

const alignedMath = String.raw`$$
\begin{aligned}
y &= x + 1 \\
z &= \sqrt{a^2 + b^2}
\end{aligned}
$$`

let routeDir: string | undefined

afterEach(async () => {
  if (routeDir) {
    await rm(routeDir, {force: true, recursive: true})
    routeDir = undefined
  }
})

describe("KnowledgeExporter math", () => {
  test.each([
    {
      content: String.raw`$$ y = x + 1 $$

$$ \sqrt{a^2 + b^2} $$`,
      expected: String.raw`$y = x + 1$

$\sqrt{a^2 + b^2}$`,
      name: "the LaTeX page equations",
      searchText: String.raw`y = x + 1 \sqrt{a^2 + b^2}`,
    },
    {
      content: String.raw`The ratio is $\frac{a}{b}$ and costs \$5.`,
      expected: String.raw`The ratio is $\frac{a}{b}$ and costs \$5.`,
      name: "inline math alongside literal currency",
      searchText: String.raw`The ratio is \frac{a}{b} and costs $5.`,
    },
    {
      content: String.raw`$$
\frac{1}{2} < \sqrt{a^2 + b^2}
$$`,
      expected: String.raw`$$
\frac{1}{2} < \sqrt{a^2 + b^2}
$$`,
      name: "display math containing MDX-sensitive syntax",
      searchText: String.raw`\frac{1}{2} < \sqrt{a^2 + b^2}`,
    },
    {
      content: alignedMath,
      expected: alignedMath,
      name: "aligned equations across multiple lines",
      searchText: String.raw`\begin{aligned} y &= x + 1 \\ z &= \sqrt{a^2 + b^2} \end{aligned}`,
    },
    {
      content: "$$\na_{n}\n\n+ b\n$$",
      expected: "$$\na_{n}\n\n+ b\n$$",
      name: "blank lines inside display math",
      searchText: "a_{n} + b",
    },
    {
      content: String.raw`$$ \sqrt{\frac{a}{b}} $$`,
      expected: String.raw`$\sqrt{\frac{a}{b}}$`,
      name: "nested LaTeX commands",
      searchText: String.raw`\sqrt{\frac{a}{b}}`,
    },
    {
      content: "$$\na_{n} + b",
      expected: "$$\na_{n} + b\n$$",
      name: "an unterminated display block",
      searchText: "a_{n} + b",
    },
    {
      content: "Use `$$ \\sqrt{a} $$`.\n\n```mdx\n$$ \\sqrt{a} $$\n```",
      expected: "Use `$$ \\sqrt{a} $$`.\n\n```mdx\n$$ \\sqrt{a} $$\n```",
      name: "literal math examples in code",
      searchText: String.raw`Use $$ \sqrt{a} $$ .`,
      sectionContent: "Use `$$ \\sqrt{a} $$`.",
    },
    {
      content: String.raw`[$\sqrt{a}$](https://example.com/formula)`,
      expected: String.raw`[$\sqrt{a}$](https://example.com/formula)`,
      name: "math in link labels",
      searchText: String.raw`\sqrt{a}`,
      sectionContent: "`\\sqrt{a}`",
    },
  ])(
    "preserves $name in exported pages and search text",
    async ({content, expected, searchText, sectionContent}) => {
      const directory = await writeMathPage(content)
      const exporter = new KnowledgeExporter(
        {routeDir: directory},
        new MdxFileReader(false),
      )
      const {pages, sections} = await exporter.generate()

      expect(pages.pages).toEqual([
        expect.objectContaining({
          content: `# LaTeX\n\n${expected}`,
          pathname: "/latex",
        }),
      ])
      expect(sections.sections).toEqual([
        expect.objectContaining({
          content: sectionContent ?? expected,
          rawContent: expected,
          searchText,
        }),
      ])
    },
  )

  test.each([false, true])(
    "exports math in extra files with processAsMdx=%s",
    async (processAsMdx) => {
      const directory = await writeMathPage("Page content.")
      const exporter = new KnowledgeExporter(
        {
          extraFiles: [
            {
              contents: alignedMath,
              id: "extra",
              processAsMdx,
              title: "Extra",
            },
          ],
          routeDir: directory,
        },
        new MdxFileReader(false),
      )
      const {pages, sections} = await exporter.generate()

      expect(pages.pages).toContainEqual(
        expect.objectContaining({
          content: `# Extra\n\n${alignedMath}`,
          pageId: "extra",
        }),
      )
      expect(sections.sections).toContainEqual(
        expect.objectContaining({
          content: alignedMath,
          pageId: "extra",
          rawContent: alignedMath,
        }),
      )
    },
  )

  test("indexes math when page link validation is enabled", async () => {
    const directory = await writeMathPage(alignedMath)
    const indexer = new SearchIndexer({
      navConfig: [],
      pageDirectory: ".",
      srcDir: directory,
      throwOnError: true,
      validatePageLinks: true,
    })

    indexer.buildIndex([join(directory, "latex.mdx")])

    expect(indexer.searchIndex).toEqual([
      expect.objectContaining({content: alignedMath}),
    ])
  })
})

async function writeMathPage(content: string): Promise<string> {
  routeDir = await mkdtemp(join(tmpdir(), "qui-knowledge-math-"))
  await writeFile(
    join(routeDir, "latex.mdx"),
    `---\ntitle: LaTeX\n---\n\n# {frontmatter.title}\n\n${content}\n`,
    "utf8",
  )
  return routeDir
}
