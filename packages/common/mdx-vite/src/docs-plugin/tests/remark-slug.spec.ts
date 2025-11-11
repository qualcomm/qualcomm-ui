import type {Element, Root} from "hast"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {rehypeSlug} from "../rehype"

function createHeading(tagName: string, text: string, id?: string): Element {
  return {
    children: [{type: "text", value: text}],
    properties: id ? {id} : {},
    tagName,
    type: "element",
  }
}

function createTree(
  headings: Array<{id?: string; tag: string; text: string}>,
): Root {
  return {
    children: headings.map((h) => createHeading(h.tag, h.text, h.id)),
    type: "root",
  }
}

async function process(tree: Root, options?: Parameters<typeof rehypeSlug>[0]) {
  await unified().use(rehypeSlug, options).run(tree)
  return tree
}

describe("rehypeSlug", () => {
  test("converts PascalCase to kebab-case", async () => {
    const tree = createTree([{tag: "h2", text: "TreeBranchIndentGuide"}])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe(
      "tree-branch-indent-guide",
    )
  })

  test("lowercases single words", async () => {
    const tree = createTree([
      {tag: "h2", text: "Ranges"},
      {tag: "h2", text: "Overview"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe("ranges")
    expect((tree.children[1] as Element).properties.id).toBe("overview")
  })

  test("converts multi-word text to kebab-case", async () => {
    const tree = createTree([
      {tag: "h2", text: "Render Prop Function"},
      {tag: "h2", text: "Getting Started"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe(
      "render-prop-function",
    )
    expect((tree.children[1] as Element).properties.id).toBe("getting-started")
  })

  test("handles duplicates by appending counter", async () => {
    const tree = createTree([
      {tag: "h2", text: "Examples"},
      {tag: "h3", text: "Examples"},
      {tag: "h4", text: "Examples"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe("examples")
    expect((tree.children[1] as Element).properties.id).toBe("examples-1")
    expect((tree.children[2] as Element).properties.id).toBe("examples-2")
  })

  test("adds prefix when provided", async () => {
    const tree = createTree([
      {tag: "h2", text: "Introduction"},
      {tag: "h2", text: "TreeNode"},
    ])
    await process(tree, {prefix: "docs-"})
    expect((tree.children[0] as Element).properties.id).toBe(
      "docs-introduction",
    )
    expect((tree.children[1] as Element).properties.id).toBe("docs-tree-node")
  })

  test("only processes allowed headings", async () => {
    const tree = createTree([
      {tag: "h1", text: "Title"},
      {tag: "h2", text: "Section"},
      {tag: "h5", text: "Detail"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBeUndefined()
    expect((tree.children[1] as Element).properties.id).toBe("section")
    expect((tree.children[2] as Element).properties.id).toBeUndefined()
  })

  test("respects custom allowed headings", async () => {
    const tree = createTree([
      {tag: "h1", text: "Title"},
      {tag: "h2", text: "Section"},
    ])
    await process(tree, {allowedHeadings: ["h1"]})
    expect((tree.children[0] as Element).properties.id).toBe("title")
    expect((tree.children[1] as Element).properties.id).toBeUndefined()
  })

  test("does not overwrite existing ids", async () => {
    const tree = createTree([
      {id: "my-custom-id", tag: "h2", text: "Custom"},
      {tag: "h2", text: "Auto"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe("my-custom-id")
    expect((tree.children[1] as Element).properties.id).toBe("auto")
  })

  test("removes special characters except word/space/dash", async () => {
    const tree = createTree([{tag: "h2", text: "API: Usage & Examples"}])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe(
      "api-usage-examples",
    )
  })

  test("handles edge cases", async () => {
    const tree = createTree([
      {tag: "h2", text: "A"},
      {tag: "h2", text: "AB"},
      {tag: "h2", text: "ABC"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe("a")
    expect((tree.children[1] as Element).properties.id).toBe("ab")
    expect((tree.children[2] as Element).properties.id).toBe("abc")
  })

  test("converts component names to kebab-case", async () => {
    const tree = createTree([
      {tag: "h2", text: "<Progress>"},
      {tag: "h2", text: "<Progress.Root>"},
      {tag: "h2", text: "<Tree.BranchIndentGuide>"},
    ])
    await process(tree)
    expect((tree.children[0] as Element).properties.id).toBe("progress")
    expect((tree.children[1] as Element).properties.id).toBe("progress-root")
    expect((tree.children[2] as Element).properties.id).toBe(
      "tree-branch-indent-guide",
    )
  })
})
