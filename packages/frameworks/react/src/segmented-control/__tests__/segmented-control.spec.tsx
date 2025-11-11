import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"

import type {MultiComponentTestCase} from "@qualcomm-ui/react-test-utils"

import {
  CompositeComponent,
  globalItems,
  SimpleComponent,
} from "./test-segmented-control.js"

const item1 = page.getByTestId(globalItems[0])
const item2 = page.getByTestId(globalItems[1])
const item3 = page.getByTestId(globalItems[2])

const tests: MultiComponentTestCase[] = [
  {
    composite: () => <CompositeComponent />,
    simple: () => <SimpleComponent />,
    testCase(component) {
      test(`Should default to single selection — ${component.name}`, async () => {
        render(component())

        expect(item1).toHaveAttribute("data-state", "unchecked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item1.click()
        expect(item1).toHaveAttribute("data-state", "checked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item3.click()
        expect(item1).toHaveAttribute("data-state", "unchecked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => <CompositeComponent multiple />,
    simple: () => <SimpleComponent multiple />,
    testCase(component) {
      test(`'multiple' should allow multiple selections — ${component.name}`, async () => {
        render(component())

        expect(item1).toHaveAttribute("data-state", "unchecked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item1.click()
        expect(item1).toHaveAttribute("data-state", "checked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item3.click()
        expect(item1).toHaveAttribute("data-state", "checked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => <CompositeComponent />,
    simple: () => <SimpleComponent />,
    testCase(component) {
      test(`Keyboard navigation — ${component.name}`, async () => {
        render(component())

        expect(item1).not.toHaveAttribute("data-focus")
        await userEvent.tab()
        expect(item1).toHaveAttribute("data-focus")

        await userEvent.tab()
        await userEvent.tab()
        expect(item3).toHaveAttribute("data-focus")
        expect(item1).not.toHaveAttribute("data-focus")

        await userEvent.tab({shift: true})
        expect(item2).toHaveAttribute("data-focus")
        expect(item3).not.toHaveAttribute("data-focus")
      })
    },
  },
  {
    composite: () => <CompositeComponent multiple />,
    simple: () => <SimpleComponent multiple />,
    testCase(component) {
      test(`Keyboard selection — ${component.name}`, async () => {
        render(component())

        await userEvent.tab()
        await userEvent.keyboard("{Enter}")
        expect(item1).toHaveAttribute("data-state", "checked")

        await userEvent.tab()
        await userEvent.tab()
        await userEvent.keyboard("{Space}")
        expect(item3).toHaveAttribute("data-state", "checked")
        expect(item1).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => <CompositeComponent multiple={false} />,
    simple: () => <SimpleComponent multiple={false} />,
    testCase(component) {
      test(`Can't unselect in single selection mode — ${component.name}`, async () => {
        render(component())

        await item2.click()
        expect(item2).toHaveAttribute("data-state", "checked")

        await item2.click()
        expect(item2).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeComponent onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleComponent onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`'onValueChange' should be called when value changes (single mode) — ${component.name}`, async () => {
        const onValueChange = vi.fn()
        render(component({onValueChange}))

        await item2.click()
        expect(onValueChange).toHaveBeenCalledWith([globalItems[1]])

        await item1.click()
        expect(onValueChange).toHaveBeenCalledWith([globalItems[0]])
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeComponent multiple onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleComponent multiple onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`'onValueChange' should be called when value changes (multiple mode) — ${component.name}`, async () => {
        const onValueChange = vi.fn()
        render(component({onValueChange}))

        await item2.click()
        expect(onValueChange).toHaveBeenCalledWith([globalItems[1]])

        await item1.click()
        expect(onValueChange).toHaveBeenCalledWith([
          globalItems[1],
          globalItems[0],
        ])
      })
    },
  },
]

describe("Segmented Control", () => {
  for (const {composite, simple, testCase} of tests) {
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }
})
