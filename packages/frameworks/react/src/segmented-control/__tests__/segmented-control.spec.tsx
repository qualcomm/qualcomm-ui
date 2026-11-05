import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import type {MultiComponentTestCase} from "@qualcomm-ui/react-test-utils"

import {
  CompositeComponent,
  globalItems,
  SimpleComponent,
} from "./test-segmented-control"

const item1 = page.getByTestId(globalItems[0])
const item2 = page.getByTestId(globalItems[1])
const item3 = page.getByTestId(globalItems[2])

const tests: MultiComponentTestCase[] = [
  {
    composite: () => <CompositeComponent />,
    simple: () => <SimpleComponent />,
    testCase(component) {
      test(`Should default to single selection — ${component.name}`, async () => {
        await render(component())

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
        await render(component())

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
        await render(component())

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
        await render(component())

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
        await render(component())

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
        await render(component({onValueChange}))

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
        await render(component({onValueChange}))

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
  {
    composite: ({onValueChange}) => (
      <CompositeComponent disabled onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleComponent disabled onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`'disabled' at root level: clicks do not fire onValueChange — ${component.name}`, async () => {
        const onValueChange = vi.fn()
        await render(component({onValueChange}))

        await item1.click({force: true})
        await item2.click({force: true})
        await item3.click({force: true})

        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeComponent
        itemProps={{[globalItems[1]]: {disabled: true}}}
        onValueChange={onValueChange}
      />
    ),
    simple: ({onValueChange}) => (
      <SimpleComponent
        itemProps={{[globalItems[1]]: {disabled: true}}}
        onValueChange={onValueChange}
      />
    ),
    testCase(component) {
      test(`'disabled' at item level: only the disabled item is inert — ${component.name}`, async () => {
        const onValueChange = vi.fn()
        await render(component({onValueChange}))

        await item2.click({force: true})
        expect(onValueChange).not.toHaveBeenCalled()

        await item1.click()
        expect(onValueChange).toHaveBeenLastCalledWith([globalItems[0]])

        await item3.click()
        expect(onValueChange).toHaveBeenLastCalledWith([globalItems[2]])
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeComponent
        defaultValue={[globalItems[1]]}
        onValueChange={onValueChange}
      />
    ),
    simple: ({onValueChange}) => (
      <SimpleComponent
        defaultValue={[globalItems[1]]}
        onValueChange={onValueChange}
      />
    ),
    testCase(component) {
      test(`'defaultValue' seeds initial selection — ${component.name}`, async () => {
        const onValueChange = vi.fn()
        await render(component({onValueChange}))

        // defaultValue is initial state — no callback yet
        expect(onValueChange).not.toHaveBeenCalled()

        // selecting a new item transitions from the initial item
        await item3.click()
        expect(onValueChange).toHaveBeenLastCalledWith([globalItems[2]])
      })
    },
  },
  {
    composite() {
      function Controlled() {
        const [value, setValue] = useState<string[] | null | undefined>([
          globalItems[0],
        ])
        return <CompositeComponent onValueChange={setValue} value={value} />
      }
      return <Controlled />
    },
    simple() {
      function Controlled() {
        const [value, setValue] = useState<string[] | null | undefined>([
          globalItems[0],
        ])
        return <SimpleComponent onValueChange={setValue} value={value} />
      }
      return <Controlled />
    },
    testCase(component) {
      test(`controlled value state reflects external updates — ${component.name}`, async () => {
        await render(component())

        const input1 = page.getByLabelText(globalItems[0])
        const input2 = page.getByLabelText(globalItems[1])
        const input3 = page.getByLabelText(globalItems[2])

        await expect.element(input1).toBeChecked()
        await expect.element(input2).not.toBeChecked()
        await expect.element(input3).not.toBeChecked()

        await item3.click()
        await expect.element(input3).toBeChecked()
        await expect.element(input1).not.toBeChecked()

        await item2.click()
        await expect.element(input2).toBeChecked()
        await expect.element(input3).not.toBeChecked()
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
