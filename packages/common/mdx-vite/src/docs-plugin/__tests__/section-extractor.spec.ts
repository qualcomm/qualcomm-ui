// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {SectionExtractor} from "../markdown/knowledge/section-extractor"
import {createRemarkProcessor} from "../markdown/remark-pipeline"
import {remarkSerializeJsxKnowledge} from "../remark"

function parseMarkdown(markdown: string): Root {
  return unified().use(remarkParse).parse(markdown)
}

function parseGfmMarkdown(markdown: string): Root {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown)
}

describe("SectionExtractor", () => {
  const pageInfo = {
    frontmatter: {},
    id: "test-page",
    pathname: "/test-page",
    title: "Test Page",
    url: "https://docs.example.com/test-page",
  }

  describe("basic extraction", () => {
    test("extracts H2 sections by default", () => {
      const markdown = `
# Test Page

Introduction content.

## Section One

Section one content.

## Section Two

Section two content.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(3)
      expect(sections[0].headerPath).toEqual(["Test Page"])
      expect(sections[0].content).toContain("Introduction content.")
      expect(sections[1].headerPath).toEqual(["Test Page", "Section One"])
      expect(sections[1].content).toContain("Section one content.")
      expect(sections[2].headerPath).toEqual(["Test Page", "Section Two"])
      expect(sections[2].content).toContain("Section two content.")
    })

    test("extracts H3 sections nested under H2", () => {
      const markdown = `
# Test Page

## Examples

Examples intro.

### Basic

Basic example content.

### Advanced

Advanced example content.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(3)
      expect(sections[0].headerPath).toEqual(["Test Page", "Examples"])
      expect(sections[1].headerPath).toEqual(["Test Page", "Examples", "Basic"])
      expect(sections[2].headerPath).toEqual([
        "Test Page",
        "Examples",
        "Advanced",
      ])
    })

    test("generates correct section IDs", () => {
      const markdown = `
# Test Page

## Getting Started

Content here.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].sectionId).toBe("test-page-getting-started")
    })

    test("generates correct section URLs", () => {
      const markdown = `
# Test Page

## Installation

Install content.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].url).toBe(
        "https://docs.example.com/test-page#installation",
      )
    })
  })

  describe("header path accumulation", () => {
    test("accumulates header breadcrumb correctly", () => {
      const markdown = `
# Button

## Examples

Examples intro.

### Variants

Variants content.

### Sizes

Sizes content.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const {sections} = extractor.extract(parseMarkdown(markdown), {
        ...pageInfo,
        title: "Button",
      })

      expect(sections).toHaveLength(3)
      expect(sections[0].headerPath).toEqual(["Button", "Examples"])
      expect(sections[1].headerPath).toEqual(["Button", "Examples", "Variants"])
      expect(sections[2].headerPath).toEqual(["Button", "Examples", "Sizes"])
    })

    test("resets path when encountering same-level header", () => {
      const markdown = `
# Test Page

## Section A

Content A.

### Nested A

Nested A content.

## Section B

Content B.

### Nested B

Nested B content.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(4)
      expect(sections[0].headerPath).toEqual(["Test Page", "Section A"])
      expect(sections[1].headerPath).toEqual([
        "Test Page",
        "Section A",
        "Nested A",
      ])
      expect(sections[2].headerPath).toEqual(["Test Page", "Section B"])
      expect(sections[3].headerPath).toEqual([
        "Test Page",
        "Section B",
        "Nested B",
      ])
    })
  })

  describe("terms extraction", () => {
    test("extracts terms from ::: terms ::: blocks", () => {
      const markdown = `
# Test Page

## Examples

::: terms
forms
ui
interactive
:::

Example content here.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].terms).toEqual(["forms", "ui", "interactive"])
    })

    test("removes terms blocks from content", () => {
      const markdown = `
# Test Page

## Examples

::: terms
forms
:::

Example content only.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].content).not.toContain("::: terms")
      expect(sections[0].content).not.toContain("forms")
      expect(sections[0].content).toContain("Example content only.")
    })

    test("returns undefined terms when no terms block present", () => {
      const markdown = `
# Test Page

## Examples

Just content, no metadata.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].terms).toBeUndefined()
    })
  })

  describe("content analysis", () => {
    test("extracts code examples from content", () => {
      const markdown = `
# Test Page

## With Code

Some text.

\`\`\`ts
const example = true
\`\`\`

## Without Code

Just text content.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].codeExamples).toHaveLength(1)
      expect(sections[0].codeExamples?.[0]?.code).toBe("const example = true")
      expect(sections[0].codeExamples?.[0]?.language).toBe("ts")
      expect(sections[0].content).not.toContain("```")
      expect(sections[0].content).toContain("Some text.")
      expect(sections[1].codeExamples).toBeUndefined()
    })

    test("rawContent includes code blocks while content excludes them", () => {
      const markdown = `
# Test Page

## Examples

Intro text.

\`\`\`tsx
function Demo() {
  return <div>Hello</div>
}
\`\`\`

Outro text.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].rawContent).toContain("```tsx")
      expect(sections[0].rawContent).toContain("function Demo()")
      expect(sections[0].rawContent).toContain("Intro text.")
      expect(sections[0].rawContent).toContain("Outro text.")

      expect(sections[0].content).not.toContain("```")
      expect(sections[0].content).not.toContain("function Demo()")
      expect(sections[0].content).toContain("Intro text.")
      expect(sections[0].content).toContain("Outro text.")
    })

    test("converts links to inline code in content", () => {
      const markdown = `
# Test Page

## Examples

Check out [the docs](https://example.com/docs) for more info.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].content).toContain("`the docs`")
      expect(sections[0].content).not.toContain("https://example.com")
      expect(sections[0].content).not.toContain("[the docs]")

      expect(sections[0].rawContent).toContain(
        "[the docs](https://example.com/docs)",
      )
    })

    test("extracts multiple interleaved code blocks", () => {
      const markdown = `
# Test Page

## Examples

Intro text.

\`\`\`tsx
function Example() {
  return <div>Hello</div>
}
\`\`\`

Middle text.

\`\`\`css
.example { color: red; }
\`\`\`

Outro text.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      const section = sections[0]

      expect(section.codeExamples).toHaveLength(2)
      expect(section.codeExamples?.[0].language).toBe("tsx")
      expect(section.codeExamples?.[1].language).toBe("css")

      expect(section.rawContent).toContain("```tsx")
      expect(section.rawContent).toContain("```css")
      expect(section.rawContent).toContain("Intro text.")
      expect(section.rawContent).toContain("Middle text.")
      expect(section.rawContent).toContain("Outro text.")
    })
  })

  describe("configuration options", () => {
    test("respects custom depths", () => {
      const markdown = `
# Test Page

## H2 Section

### H3 Section

#### H4 Section
`
      const extractor = new SectionExtractor({depths: [2]})
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page", "H2 Section"])
    })

    test("includes H1 when configured", () => {
      const markdown = `
# Test Page

Page introduction.

## Section
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      // H1 becomes a section with intro content
      expect(sections.length).toBeGreaterThanOrEqual(1)
    })

    test("filters by minimum content length", () => {
      const markdown = `
# Test Page

## Empty Section

## Content Section

This section has enough content to pass the minimum length filter.
`
      const extractor = new SectionExtractor({minContentLength: 20})
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page", "Content Section"])
    })
  })

  describe("edge cases", () => {
    test("handles empty sections", () => {
      const markdown = `
# Test Page

## Empty Section

## Another Empty
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      // Empty sections should be filtered out
      expect(sections).toHaveLength(0)
    })

    test("captures content from pages with only H1", () => {
      const markdown = `
# Test Page

Just some content without subsections.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page"])
      expect(sections[0].content).toContain(
        "Just some content without subsections.",
      )
    })

    test("handles headers in code blocks (should not extract)", () => {
      const markdown = `
# Test Page

## Real Section

\`\`\`markdown
## Fake Header In Code

This should not be extracted.
\`\`\`

Real content.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page", "Real Section"])
    })

    test("extracts headings that contain only inline code", () => {
      const markdown = `
# Test Page

### Rules

#### \`accessible-name\`

Enforces that certain components have an aria-label attribute.

#### \`avatar-image-alt\`

Enforces that Avatar components have alt text.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(2)
      expect(sections[0].headerPath).toEqual([
        "Test Page",
        "Rules",
        "accessible-name",
      ])
      expect(sections[1].headerPath).toEqual([
        "Test Page",
        "Rules",
        "avatar-image-alt",
      ])
    })

    test("handles special characters in headers", () => {
      const markdown = `
# Test Page

## What's New?

Content here.

## API Reference (v2.0)

More content.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections).toHaveLength(2)
      expect(sections[0].sectionId).toBe("test-page-whats-new")
      expect(sections[1].sectionId).toBe("test-page-api-reference-v20")
    })
  })

  describe("extractPage", () => {
    test("returns full raw markdown content", () => {
      const markdown = `
# Test Page

Introduction content.

## Section One

Section one content.

\`\`\`ts
const example = true
\`\`\`

## Section Two

Section two content.
`
      const extractor = new SectionExtractor()
      const page = extractor.extractPage(parseMarkdown(markdown), pageInfo)

      expect(page).not.toBeNull()
      expect(page!.content).toContain("# Test Page")
      expect(page!.content).toContain("Introduction content.")
      expect(page!.content).toContain("## Section One")
      expect(page!.content).toContain("Section one content.")
      expect(page!.content).toContain("```ts")
      expect(page!.content).toContain("const example = true")
      expect(page!.content).toContain("## Section Two")
      expect(page!.content).toContain("Section two content.")
    })

    test("excludes YAML frontmatter", () => {
      const tree: Root = {
        children: [
          {type: "yaml", value: "title: Test Page\ndescription: A test page"},
          {
            children: [{type: "text", value: "Test Page"}],
            depth: 1,
            type: "heading",
          },
          {
            children: [{type: "text", value: "Page content here."}],
            type: "paragraph",
          },
        ],
        type: "root",
      }
      const extractor = new SectionExtractor()
      const page = extractor.extractPage(tree, pageInfo)

      expect(page).not.toBeNull()
      expect(page!.content).not.toContain("title: Test Page")
      expect(page!.content).toContain("# Test Page")
      expect(page!.content).toContain("Page content here.")
    })

    test("returns correct pageId, pathname, and title", () => {
      const markdown = `
# Test Page

Some content.
`
      const extractor = new SectionExtractor()
      const page = extractor.extractPage(parseMarkdown(markdown), pageInfo)

      expect(page!.pageId).toBe("test-page")
      expect(page!.pathname).toBe("/test-page")
      expect(page!.title).toBe("Test Page")
    })

    test("generates a hash", () => {
      const markdown = `
# Test Page

Some content.
`
      const extractor = new SectionExtractor()
      const page = extractor.extractPage(parseMarkdown(markdown), pageInfo)

      expect(page!.hash).toBeDefined()
      expect(page!.hash).toMatch(/^[a-f0-9]{32}$/)
    })

    test("returns null for empty AST", () => {
      const tree: Root = {children: [], type: "root"}
      const extractor = new SectionExtractor()
      const page = extractor.extractPage(tree, pageInfo)

      expect(page).toBeNull()
    })

    test("returns null for AST with only frontmatter", () => {
      const tree: Root = {
        children: [{type: "yaml", value: "title: Test"}],
        type: "root",
      }
      const extractor = new SectionExtractor()
      const page = extractor.extractPage(tree, pageInfo)

      expect(page).toBeNull()
    })
  })

  describe("GFM table handling", () => {
    test("preserves table pipes when parsed with remarkGfm", () => {
      const markdown = `
# Test Page

## States

| checked | indeterminate | Result |
| ------- | ------------- | ------ |
| true    | false         | check  |
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseGfmMarkdown(markdown), pageInfo)

      expect(sections[0].rawContent).toContain("| checked |")
      expect(sections[0].rawContent).not.toContain("\\|")
    })

    test("escapes table pipes when parsed without remarkGfm", () => {
      const markdown = `
# Test Page

## States

| checked | indeterminate | Result |
| ------- | ------------- | ------ |
| true    | false         | check  |
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].rawContent).toContain("\\|")
    })
  })

  describe("unicode preservation", () => {
    test("preserves em dash in content", () => {
      const markdown = `
# Test Page

## Forms

Choose the library that fits your needs\u2014we've built examples.
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].content).toContain("\u2014")
      expect(sections[0].rawContent).toContain("\u2014")
    })

    test("preserves emojis in code blocks", () => {
      const markdown = `
# Test Page

## Guidelines

\`\`\`tsx
/* Won't work alone \u274C */
/* Works as expected \u2705 */
\`\`\`
`
      const extractor = new SectionExtractor()
      const {sections} = extractor.extract(parseMarkdown(markdown), pageInfo)

      expect(sections[0].rawContent).toContain("\u274C")
      expect(sections[0].rawContent).toContain("\u2705")
      expect(sections[0].codeExamples?.[0]?.code).toContain("\u274C")
      expect(sections[0].codeExamples?.[0]?.code).toContain("\u2705")
    })
  })
})

const searchPageInfo = {
  frontmatter: {},
  id: "test-page",
  pathname: "/test-page",
  title: "Test Page",
  url: "https://docs.example.com/test-page",
}

describe("serialize-jsx directive in the search-index pipeline", () => {
  function processForSearch(mdx: string): Root {
    const processor = createRemarkProcessor({
      mdx: true,
      plugins: [remarkSerializeJsxKnowledge],
      removeJsx: true,
    })
    return processor.runSync(processor.parse(mdx)) as Root
  }

  test("keeps prose and strips JSX and markers", () => {
    const mdx = `## Section\n\n::: serialize-jsx\n\nThe demo shows reordering by array position.\n\n<NestedRouteOrderDemo />\n\n:::`
    const tree = processForSearch(mdx)
    const extractor = new SectionExtractor()
    const {sections} = extractor.extract(tree, searchPageInfo)

    expect(sections[0].content).toContain("The demo shows reordering")
    expect(sections[0].content).not.toContain("::: serialize-jsx")
    expect(sections[0].content).not.toContain("<NestedRouteOrderDemo")
  })

  test("leaves no marker text in rawContent", () => {
    const mdx = `## Section\n\n::: serialize-jsx\n\nSome description.\n\n<SomeDemo />\n\n:::`
    const tree = processForSearch(mdx)
    const extractor = new SectionExtractor()
    const {sections} = extractor.extract(tree, searchPageInfo)

    expect(sections[0].rawContent).not.toContain("::: serialize-jsx")
    expect(sections[0].rawContent).not.toContain(":::")
  })
})
