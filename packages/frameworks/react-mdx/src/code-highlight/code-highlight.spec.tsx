import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {dummyTypePrefix} from "@qualcomm-ui/react-mdx/shiki"

import {CodeHighlight, type HighlightedReference} from "./index.js"

const references: Record<string, HighlightedReference> = {
  ListFilterDefinition: {
    description: "A list filter.",
    prettyType: "type ListFilterDefinition = {kind: 'list'}",
  },
}

const card = () => page.getByRole("dialog")

/**
 * The text of the focused element, or `null` when focus left the code.
 */
function focusedText(): string | null {
  const element = document.activeElement
  return element && element !== document.body ? element.textContent : null
}

describe("CodeHighlight highlightedReferences", () => {
  test("hovering a type reference shows the referenced type", async () => {
    await render(
      <CodeHighlight
        code="(filter: ListFilterDefinition) => void"
        disableCopy
        highlightedReferences={references}
        language="tsx"
      />,
    )

    await page.getByText("ListFilterDefinition").hover()

    await expect
      .element(card())
      .toHaveTextContent(
        "type ListFilterDefinition = {kind: 'list'}A list filter.",
      )
  })

  test("a focused type reference is described by its card until Escape", async () => {
    await render(
      <CodeHighlight
        code="(filter: ListFilterDefinition) => void"
        disableCopy
        highlightedReferences={references}
        language="tsx"
      />,
    )

    await userEvent.tab()

    const reference = page.elementLocator(document.activeElement!)
    expect(focusedText()).toBe("ListFilterDefinition")
    await expect.element(card()).toBeVisible()
    await expect
      .element(reference)
      .toHaveAccessibleDescription(
        /^type ListFilterDefinition = \{kind: 'list'\}\s*A list filter\.$/,
      )

    await userEvent.keyboard("{Escape}")

    await expect.element(card()).not.toBeInTheDocument()
    expect(focusedText()).toBe("ListFilterDefinition")
  })

  test("only type references with a known name are tab stops", async () => {
    await render(
      <CodeHighlight
        code={`${dummyTypePrefix}${[
          "{",
          "  ListFilterDefinition: 'ListFilterDefinition'",
          "  namespaced: Filters.ListFilterDefinition",
          "  other: TextFilterDefinition",
          "  typed: ListFilterDefinition",
          "}",
        ].join("\n")}`}
        disableCopy
        highlightedReferences={references}
        language="tsx"
      />,
    )

    const stops: (string | null)[] = []
    for (let index = 0; index < 2; index++) {
      await userEvent.tab()
      stops.push(focusedText())
    }

    // the reference in `typed`, then out of the code.
    expect(stops).toEqual(["ListFilterDefinition", null])
  })
})
