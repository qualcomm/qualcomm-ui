import type {Element, ElementContent, Root, RootContent} from "hast"
import type {MdxJsxFlowElementHast} from "mdast-util-mdx-jsx"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {rehypeSectionize} from "../rehype"

function createHeading(tagName: string, id: string): Element {
  return {
    children: [{type: "text", value: id}],
    properties: {id},
    tagName,
    type: "element",
  }
}

function createParagraph(text: string): Element {
  return {
    children: [{type: "text", value: text}],
    properties: {},
    tagName: "p",
    type: "element",
  }
}

function createSteps(children: ElementContent[]): MdxJsxFlowElementHast {
  return {
    attributes: [],
    children,
    name: "HeadingSteps",
    type: "mdxJsxFlowElement",
  }
}

async function process(children: RootContent[]): Promise<Root> {
  const tree: Root = {children, type: "root"}
  return await unified().use(rehypeSectionize).run(tree)
}

function asElement(node: RootContent | ElementContent | undefined): Element {
  if (node?.type !== "element") {
    throw new Error("expected element")
  }
  return node
}

describe("rehypeSectionize", () => {
  test("wraps headings in nested sections", async () => {
    const tree = await process([
      createHeading("h2", "one"),
      createParagraph("a"),
      createHeading("h3", "two"),
      createHeading("h2", "three"),
    ])

    const [first, second] = tree.children.map(asElement)
    expect(first.properties).toMatchObject({
      ariaLabelledby: "one",
      className: ["heading"],
      dataHeadingRank: 2,
    })
    expect(asElement(first.children[2]).properties).toMatchObject({
      ariaLabelledby: "two",
      dataHeadingRank: 3,
    })
    expect(second.properties.ariaLabelledby).toBe("three")
  })

  test("sectionizes headings inside steps with the step class", async () => {
    const tree = await process([
      createHeading("h2", "intro"),
      createSteps([
        createParagraph("lead"),
        createHeading("h2", "step-1"),
        createParagraph("a"),
        createHeading("h3", "step-1-detail"),
        createHeading("h2", "step-2"),
      ]),
      createHeading("h2", "after"),
    ])

    const [intro, after] = tree.children.map(asElement)
    expect(after.properties.ariaLabelledby).toBe("after")

    const steps = intro.children[1] as MdxJsxFlowElementHast
    expect(steps.name).toBe("HeadingSteps")
    expect(asElement(steps.children[0]).tagName).toBe("p")

    const [step1, step2] = steps.children.slice(1).map(asElement)
    expect(step1.properties).toMatchObject({
      ariaLabelledby: "step-1",
      className: ["qui-docs__step-section"],
      dataHeadingRank: 2,
    })
    expect(asElement(step1.children[2]).properties).toMatchObject({
      ariaLabelledby: "step-1-detail",
      className: ["qui-docs__step-section"],
      dataHeadingRank: 3,
    })
    expect(step2.properties.ariaLabelledby).toBe("step-2")
  })
})
