import {type FormEvent, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import type {MultiComponentTestCase} from "@qualcomm-ui/react-test-utils"

import {runTests} from "~test-utils/runner"

import {
  clickFocusTarget,
  CompositeTextArea,
  SimpleTextArea,
  testIds,
} from "./test-text-area"

const demoLabel = "Demo Label"
const demoPlaceholder = "Enter text here"
const demoHint = "This is a helpful hint"
const demoErrorText = "This field is required"

const tests: MultiComponentTestCase[] = [
  {
    composite: () => (
      <CompositeTextArea label={demoLabel} placeholder={demoPlaceholder} />
    ),
    simple: () => (
      <SimpleTextArea label={demoLabel} placeholder={demoPlaceholder} />
    ),
    testCase(component) {
      test(`label association and focus - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await page.getByTestId(testIds.label).click()
        await expect.element(page.getByTestId(testIds.input)).toHaveFocus()
        await expect
          .element(page.getByTestId(testIds.input))
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        hint={demoHint}
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    simple: () => (
      <SimpleTextArea
        hint={demoHint}
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    testCase(component) {
      test(`hint text display - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.hint)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.hint))
          .toHaveTextContent(demoHint)
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        hint={demoHint}
        invalid
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    simple: () => (
      <SimpleTextArea
        hint={demoHint}
        invalid
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    testCase(component) {
      test(`hint hidden when invalid - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.hint)).not.toBeVisible()
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        errorText={demoErrorText}
        invalid
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    simple: () => (
      <SimpleTextArea
        errorText={demoErrorText}
        invalid
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    testCase(component) {
      test(`error state and error text - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.errorText)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.errorText))
          .toHaveTextContent(demoErrorText)
        await expect
          .element(page.getByTestId(testIds.input))
          .toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        errorText={demoErrorText}
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    simple: () => (
      <SimpleTextArea
        errorText={demoErrorText}
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    testCase(component) {
      test(`error text hidden when not invalid - ${component.name}`, async () => {
        await render(component())
        await expect
          .element(page.getByTestId(testIds.errorText))
          .not.toBeVisible()
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        disabled
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    simple: () => (
      <SimpleTextArea
        disabled
        label={demoLabel}
        placeholder={demoPlaceholder}
      />
    ),
    testCase(component) {
      test(`disabled state - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.input)).toBeDisabled()
        await expect
          .element(page.getByTestId(testIds.root))
          .toHaveAttribute("data-disabled")
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        label={demoLabel}
        placeholder={demoPlaceholder}
        required
      />
    ),
    simple: () => (
      <SimpleTextArea
        label={demoLabel}
        placeholder={demoPlaceholder}
        required
      />
    ),
    testCase(component) {
      test(`required state - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.input)).toBeRequired()
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        defaultValue="Read only value"
        label={demoLabel}
        placeholder={demoPlaceholder}
        readOnly
      />
    ),
    simple: () => (
      <SimpleTextArea
        defaultValue="Read only value"
        label={demoLabel}
        placeholder={demoPlaceholder}
        readOnly
      />
    ),
    testCase(component) {
      test(`read-only state - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("Read only value")
      })
    },
  },
  {
    composite: () => <CompositeTextArea dir="rtl" label={demoLabel} />,
    simple: () => <SimpleTextArea dir="rtl" label={demoLabel} />,
    testCase(component) {
      test(`RTL direction - ${component.name}`, async () => {
        await render(component())
        await expect
          .element(page.getByTestId(testIds.root))
          .toHaveAttribute("dir", "rtl")
      })
    },
  },
]

const counterTests: MultiComponentTestCase[] = [
  {
    composite: () => (
      <CompositeTextArea
        defaultValue="Hello"
        label={demoLabel}
        maxLength={100}
      />
    ),
    simple: () => (
      <SimpleTextArea defaultValue="Hello" label={demoLabel} maxLength={100} />
    ),
    testCase(component) {
      test(`counter shows current/max with maxLength - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.counter)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.counter))
          .toHaveTextContent("5/100")
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea counter defaultValue="Hello" label={demoLabel} />
    ),
    simple: () => (
      <SimpleTextArea counter defaultValue="Hello" label={demoLabel} />
    ),
    testCase(component) {
      test(`counter shows count only without maxLength - ${component.name}`, async () => {
        await render(component())
        await expect.element(page.getByTestId(testIds.counter)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.counter))
          .toHaveTextContent("5")
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea counter={false} label={demoLabel} maxLength={100} />
    ),
    simple: () => (
      <SimpleTextArea counter={false} label={demoLabel} maxLength={100} />
    ),
    testCase(component) {
      test(`counter hidden when counter=false - ${component.name}`, async () => {
        await render(component())
        await expect
          .element(page.getByTestId(testIds.counter))
          .not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => <CompositeTextArea label={demoLabel} maxLength={50} />,
    simple: () => <SimpleTextArea label={demoLabel} maxLength={50} />,
    testCase(component) {
      test(`counter updates as user types - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        const counter = page.getByTestId(testIds.counter)

        await expect.element(counter).toHaveTextContent("0/50")
        await input.fill("Test")
        await expect.element(counter).toHaveTextContent("4/50")
      })
    },
  },
]

const controlledStateTests: MultiComponentTestCase[] = [
  {
    composite: () => {
      const TestComponent = () => {
        const [value, setValue] = useState("")
        return (
          <CompositeTextArea
            label={demoLabel}
            onValueChange={setValue}
            placeholder={demoPlaceholder}
            value={value}
          />
        )
      }
      return <TestComponent />
    },
    simple: () => {
      const TestComponent = () => {
        const [value, setValue] = useState("")
        return (
          <SimpleTextArea
            label={demoLabel}
            onValueChange={setValue}
            placeholder={demoPlaceholder}
            value={value}
          />
        )
      }
      return <TestComponent />
    },
    testCase(component) {
      test(`controlled value - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        await input.fill("test input")
        await expect.element(input).toHaveValue("test input")
      })
    },
  },
  {
    composite: () => {
      const TestComponent = () => {
        const [value, setValue] = useState("initial")
        return (
          <div>
            <CompositeTextArea
              label={demoLabel}
              onValueChange={setValue}
              value={value}
            />
            <button
              data-test-id="update-btn"
              onClick={() => setValue("updated")}
            >
              Update
            </button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple: () => {
      const TestComponent = () => {
        const [value, setValue] = useState("initial")
        return (
          <div>
            <SimpleTextArea
              label={demoLabel}
              onValueChange={setValue}
              value={value}
            />
            <button
              data-test-id="update-btn"
              onClick={() => setValue("updated")}
            >
              Update
            </button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase(component) {
      test(`controlled value updates from parent - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        await expect.element(input).toHaveValue("initial")
        await page.getByTestId("update-btn").click()
        await expect.element(input).toHaveValue("updated")
      })
    },
  },
  {
    composite: () => {
      const TestComponent = () => {
        const [focused, setFocused] = useState(false)
        return (
          <div>
            <CompositeTextArea label={demoLabel} onFocusChange={setFocused} />
            <div data-test-id="focus-state">
              {focused ? "focused" : "blurred"}
            </div>
          </div>
        )
      }
      return <TestComponent />
    },
    simple: () => {
      const TestComponent = () => {
        const [focused, setFocused] = useState(false)
        return (
          <div>
            <SimpleTextArea label={demoLabel} onFocusChange={setFocused} />
            <div data-test-id="focus-state">
              {focused ? "focused" : "blurred"}
            </div>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase(component) {
      test(`focus change callback - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        const focusState = page.getByTestId("focus-state")

        await expect.element(focusState).toHaveTextContent("blurred")
        await input.click()
        await expect.element(focusState).toHaveTextContent("focused")
        await clickFocusTarget()
        await expect.element(focusState).toHaveTextContent("blurred")
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeTextArea label={demoLabel} onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleTextArea label={demoLabel} onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`onValueChange callback - ${component.name}`, async () => {
        const onValueChange = vi.fn()
        await render(component({onValueChange}))

        await page.getByTestId(testIds.input).fill("test")
        expect(onValueChange).toHaveBeenCalled()
        expect(onValueChange.mock.calls[0]?.[0]).toBe("test")
      })
    },
  },
]

const keyboardTests: MultiComponentTestCase[] = [
  {
    composite: () => <CompositeTextArea label={demoLabel} />,
    simple: () => <SimpleTextArea label={demoLabel} />,
    testCase(component) {
      test(`tab focuses input - ${component.name}`, async () => {
        await render(component())
        await clickFocusTarget()
        await userEvent.tab()
        await expect.element(page.getByTestId(testIds.input)).toHaveFocus()
      })
    },
  },
  {
    composite: () => <CompositeTextArea label={demoLabel} />,
    simple: () => <SimpleTextArea label={demoLabel} />,
    testCase(component) {
      test(`multiline input - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        await input.fill("Line 1\nLine 2\nLine 3")
        await expect.element(input).toHaveValue("Line 1\nLine 2\nLine 3")
      })
    },
  },
]

const propsSpreadingTests: MultiComponentTestCase[] = [
  {
    composite: () => (
      <CompositeTextArea
        className="custom-class"
        data-custom="custom-value"
        id="custom-id"
        label={demoLabel}
      />
    ),
    simple: () => (
      <SimpleTextArea
        className="custom-class"
        data-custom="custom-value"
        id="custom-id"
        label={demoLabel}
      />
    ),
    testCase(component) {
      test(`root props spreading - ${component.name}`, async () => {
        await render(component())
        const root = page.getByTestId(testIds.root)
        await expect.element(root).toHaveClass("custom-class")
        await expect.element(root).toHaveAttribute("id", "custom-id")
        await expect
          .element(root)
          .toHaveAttribute("data-custom", "custom-value")
      })
    },
  },
  {
    composite: () => (
      <CompositeTextArea
        form="custom-form"
        label={demoLabel}
        name="custom-name"
      />
    ),
    simple: () => (
      <SimpleTextArea form="custom-form" label={demoLabel} name="custom-name" />
    ),
    testCase(component) {
      test(`form props spreading - ${component.name}`, async () => {
        await render(component())
        const input = page.getByTestId(testIds.input)
        await expect.element(input).toHaveAttribute("name", "custom-name")
        await expect.element(input).toHaveAttribute("form", "custom-form")
      })
    },
  },
]

let formSubmittedData: Record<string, string> = {}

function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  formSubmittedData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >
}

const formTests: MultiComponentTestCase[] = [
  {
    composite: () => (
      <CompositeTextArea
        defaultValue="test value"
        label={demoLabel}
        name="message"
      />
    ),
    simple: () => (
      <SimpleTextArea
        defaultValue="test value"
        label={demoLabel}
        name="message"
      />
    ),
    testCase(component) {
      test(`form submission - ${component.name}`, async () => {
        await render(
          <form data-test-id="form" onSubmit={handleFormSubmit}>
            {component()}
            <button type="submit">Submit</button>
          </form>,
        )

        await page.getByText("Submit").click()
        expect(formSubmittedData).toEqual({message: "test value"})
      })
    },
  },
]

const allTests = [
  ...tests,
  ...counterTests,
  ...controlledStateTests,
  ...keyboardTests,
  ...propsSpreadingTests,
  ...formTests,
]

describe("TextArea", () => {
  runTests(allTests)
})
