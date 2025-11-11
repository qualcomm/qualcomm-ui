import {type HTMLAttributes, useState} from "react"

import {page} from "@vitest/browser/context"
import {Calendar, Search} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"

import {TextInput} from "@qualcomm-ui/react/text-input"
import {
  type MultiComponentTestCase,
  runTests,
} from "@qualcomm-ui/react-test-utils"

const demoLabel = "Demo Label"
const demoPlaceholder = "Enter text here"
const demoHint = "This is a helpful hint"
const demoErrorText = "This field is required"

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <TextInput.Root>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return <TextInput label={demoLabel} placeholder={demoPlaceholder} />
    },
    testCase: (getComponent) => {
      test("Label association and focus", async () => {
        render(getComponent())
        // Verify label is present
        await expect.element(page.getByText(demoLabel)).toBeVisible()
        // Click label should focus input
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toHaveFocus()
      })
      test("Input placeholder", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
          <TextInput.Hint>{demoHint}</TextInput.Hint>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          hint={demoHint}
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Hint text display", async () => {
        render(getComponent())
        await expect.element(page.getByText(demoHint)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root invalid>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
          <TextInput.ErrorText>{demoErrorText}</TextInput.ErrorText>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          errorText={demoErrorText}
          invalid
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Error state and error text", async () => {
        render(getComponent())
        // Error text should be visible
        await expect.element(page.getByText(demoErrorText)).toBeVisible()
        // Input should have invalid state
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root disabled>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput disabled label={demoLabel} placeholder={demoPlaceholder} />
      )
    },
    testCase: (getComponent) => {
      test("Disabled state", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root required>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput label={demoLabel} placeholder={demoPlaceholder} required />
      )
    },
    testCase: (getComponent) => {
      test("Required state", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeRequired()
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root defaultValue="Read only value" readOnly>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          defaultValue="Read only value"
          label={demoLabel}
          placeholder={demoPlaceholder}
          readOnly
        />
      )
    },
    testCase: (getComponent) => {
      test("Read-only state", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("Read only value")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root size="sm">
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput label={demoLabel} placeholder={demoPlaceholder} size="sm" />
      )
    },
    testCase: (getComponent) => {
      test("Small size variant", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root size="lg">
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput label={demoLabel} placeholder={demoPlaceholder} size="lg" />
      )
    },
    testCase: (getComponent) => {
      test("Large size variant", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root defaultValue="Initial value">
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.InputGroup>
            <TextInput.Input placeholder={demoPlaceholder} />
            <TextInput.ClearTrigger />
          </TextInput.InputGroup>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          clearable
          defaultValue="Initial value"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Clear button functionality", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        // Input should have initial value
        await expect.element(input).toHaveValue("Initial value")
        // Clear button should be visible when there's a value
        const clearButton = page.getByRole("button", {name: /clear/i})
        await expect.element(clearButton).toBeVisible()
        // Click clear button should clear the input
        await clearButton.click()
        await expect.element(input).toHaveValue("")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root startIcon={Search}>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.InputGroup>
            <TextInput.Input placeholder={demoPlaceholder} />
          </TextInput.InputGroup>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          label={demoLabel}
          placeholder={demoPlaceholder}
          startIcon={Search}
        />
      )
    },
    testCase: (getComponent) => {
      test("Start icon display", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
        // Icon presence is tested through visual rendering
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root endIcon={Calendar}>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.InputGroup>
            <TextInput.Input placeholder={demoPlaceholder} />
          </TextInput.InputGroup>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          endIcon={Calendar}
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("End icon display", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
        // Icon presence is tested through visual rendering
      })
    },
  },
]

const controlledStateTests: MultiComponentTestCase[] = [
  {
    composite() {
      const TestComponent = () => {
        const [value, setValue] = useState("")
        const onChange = vi.fn()
        const handleValueChange = (newValue: string) => {
          setValue(newValue)
          onChange(newValue)
        }
        return (
          <TextInput.Root onValueChange={handleValueChange} value={value}>
            <TextInput.Label>{demoLabel}</TextInput.Label>
            <TextInput.Input placeholder={demoPlaceholder} />
          </TextInput.Root>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [value, setValue] = useState("")
        const onChange = vi.fn()
        const handleValueChange = (newValue: string) => {
          setValue(newValue)
          onChange(newValue)
        }
        return (
          <TextInput
            label={demoLabel}
            onValueChange={handleValueChange}
            placeholder={demoPlaceholder}
            value={value}
          />
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Value change callback", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await input.fill("test input")
        // Verify input value updated
        await expect.element(input).toHaveValue("test input")
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [value, setValue] = useState("initial")
        return (
          <div>
            <TextInput.Root onValueChange={setValue} value={value}>
              <TextInput.Label>{demoLabel}</TextInput.Label>
              <TextInput.Input placeholder={demoPlaceholder} />
            </TextInput.Root>
            <button onClick={() => setValue("updated")}>Update</button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [value, setValue] = useState("initial")
        return (
          <div>
            <TextInput
              label={demoLabel}
              onValueChange={setValue}
              placeholder={demoPlaceholder}
              value={value}
            />
            <button onClick={() => setValue("updated")}>Update</button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Controlled value updates", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("initial")
        await page.getByRole("button", {name: "Update"}).click()
        await expect.element(input).toHaveValue("updated")
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [focused, setFocused] = useState(false)
        return (
          <div>
            <TextInput.Root onFocusChange={setFocused}>
              <TextInput.Label>{demoLabel}</TextInput.Label>
              <TextInput.Input placeholder={demoPlaceholder} />
            </TextInput.Root>
            <div data-test-id="focus-state">
              Focus state: {focused ? "focused" : "blurred"}
            </div>
            <button data-test-id="outside-button">Outside Button</button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [focused, setFocused] = useState(false)
        return (
          <div>
            <TextInput
              label={demoLabel}
              onFocusChange={setFocused}
              placeholder={demoPlaceholder}
            />
            <div data-test-id="focus-state">
              Focus state: {focused ? "focused" : "blurred"}
            </div>
            <button data-test-id="outside-button">Outside Button</button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Focus change callback", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        const focusState = page.getByTestId("focus-state")
        const outsideButton = page.getByTestId("outside-button")

        // Initially blurred
        await expect
          .element(focusState)
          .toHaveTextContent("Focus state: blurred")

        // Click input to focus it
        await input.click()
        await expect
          .element(focusState)
          .toHaveTextContent("Focus state: focused")

        // Click outside element to blur input
        await outsideButton.click()
        await expect
          .element(focusState)
          .toHaveTextContent("Focus state: blurred")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root
          className="custom-class"
          data-test-id="text-input-root"
          id="custom-id"
        >
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          className="custom-class"
          data-test-id="text-input-root"
          id="custom-id"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Root element props spreading", async () => {
        render(getComponent())
        const root = page.getByTestId("text-input-root")
        await expect.element(root).toBeVisible()
        await expect.element(root).toHaveClass("custom-class")
        await expect.element(root).toHaveAttribute("id", "custom-id")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input
            data-test-id="text-input-element"
            maxLength={50}
            minLength={5}
            pattern="[A-Za-z]+"
            placeholder={demoPlaceholder}
            title="Custom title"
          />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          inputProps={
            {
              "data-test-id": "text-input-element",
              maxLength: 50,
              minLength: 5,
              pattern: "[A-Za-z]+",
              title: "Custom title",
            } as HTMLAttributes<HTMLInputElement>
          }
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Input element props spreading", async () => {
        render(getComponent())
        const input = page.getByTestId("text-input-element")
        await expect.element(input).toBeVisible()
        await expect.element(input).toHaveAttribute("maxlength", "50")
        await expect.element(input).toHaveAttribute("minlength", "5")
        await expect.element(input).toHaveAttribute("pattern", "[A-Za-z]+")
        await expect.element(input).toHaveAttribute("title", "Custom title")
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root>
          <TextInput.Label className="custom-label-class" id="custom-label-id">
            {demoLabel}
          </TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          label={demoLabel}
          labelProps={{
            className: "custom-label-class",
            id: "custom-label-id",
          }}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Label props spreading", async () => {
        render(getComponent())
        const label = page.getByText(demoLabel)
        await expect.element(label).toBeVisible()
        await expect.element(label).toHaveClass("custom-label-class")
        await expect.element(label).toHaveAttribute("id", "custom-label-id")
        await expect
          .element(page.getByLabelText(demoLabel))
          .toHaveAttribute("aria-labelledby", "custom-label-id")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
          <TextInput.Hint className="custom-hint-class" id="custom-hint-id">
            {demoHint}
          </TextInput.Hint>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          hint={demoHint}
          hintProps={{
            className: "custom-hint-class",
            id: "custom-hint-id",
          }}
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Hint props spreading", async () => {
        render(getComponent())
        const hint = page.getByText(demoHint)
        await expect.element(hint).toBeVisible()
        await expect.element(hint).toHaveClass("custom-hint-class")
        await expect.element(hint).toHaveAttribute("id", "custom-hint-id")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root invalid>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
          <TextInput.ErrorText
            className="custom-error-class"
            data-test-id="error-text"
          >
            {demoErrorText}
          </TextInput.ErrorText>
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          errorText={demoErrorText}
          errorTextProps={
            {
              className: "custom-error-class",
              "data-test-id": "error-text",
            } as HTMLAttributes<HTMLElement>
          }
          invalid
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Error text props spreading", async () => {
        render(getComponent())
        const errorText = page.getByTestId("error-text")
        await expect.element(errorText).toBeVisible()
        await expect.element(errorText).toHaveClass("custom-error-class")
        await expect.element(errorText).toHaveTextContent(demoErrorText)
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root form="custom-form" name="custom-name">
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input placeholder={demoPlaceholder} />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          form="custom-form"
          label={demoLabel}
          name="custom-name"
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Form-related props spreading", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("name", "custom-name")
        await expect.element(input).toHaveAttribute("form", "custom-form")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root>
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input
            aria-describedby="custom-description"
            data-custom="custom-value"
            placeholder={demoPlaceholder}
            role="textbox"
          />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          inputProps={
            {
              "aria-describedby": "custom-description",
              "data-custom": "custom-value",
              role: "textbox",
            } as HTMLAttributes<HTMLInputElement>
          }
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("ARIA and data attributes spreading", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect
          .element(input)
          .toHaveAttribute("aria-describedby", "custom-description")
        await expect
          .element(input)
          .toHaveAttribute("data-custom", "custom-value")
        await expect.element(input).toHaveAttribute("role", "textbox")
      })
    },
  },
  {
    composite() {
      return (
        <TextInput.Root defaultValue="default text">
          <TextInput.Label>{demoLabel}</TextInput.Label>
          <TextInput.Input
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect="on"
            placeholder={demoPlaceholder}
            spellCheck="true"
          />
        </TextInput.Root>
      )
    },
    simple() {
      return (
        <TextInput
          defaultValue="default text"
          inputProps={{
            autoCapitalize: "words",
            autoComplete: "name",
            autoCorrect: "on",
            spellCheck: "true",
          }}
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Input behavior attributes spreading", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("default text")
        await expect.element(input).toHaveAttribute("autocapitalize", "words")
        await expect.element(input).toHaveAttribute("autocomplete", "name")
        await expect.element(input).toHaveAttribute("autocorrect", "on")
        await expect.element(input).toHaveAttribute("spellcheck", "true")
      })
    },
  },
]

const allTests: MultiComponentTestCase[] = [...tests, ...controlledStateTests]

describe("TextInput", () => {
  runTests(allTests)
})
