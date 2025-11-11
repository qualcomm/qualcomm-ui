import {type HTMLAttributes, type InputHTMLAttributes, useState} from "react"

import {page} from "@vitest/browser/context"
import {KeyRound} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"

import {InputStartIcon} from "@qualcomm-ui/react/input"
import {PasswordInput} from "@qualcomm-ui/react/password-input"
import {
  type MultiComponentTestCase,
  runTests,
} from "@qualcomm-ui/react-test-utils"

const demoLabel = "Demo Label"
const demoPlaceholder = "Enter password"
const demoHint = "Must be at least 8 characters"
const demoErrorText = "Password is required"

const testIds = {
  visibilityTrigger: "password-input-visibility-trigger",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return <PasswordInput label={demoLabel} placeholder={demoPlaceholder} />
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
      test("Input placeholder and type", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
        // Password input should have type="password" by default
        await expect.element(input).toHaveAttribute("type", "password")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
          <PasswordInput.Hint>{demoHint}</PasswordInput.Hint>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
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
        <PasswordInput.Root invalid>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
          <PasswordInput.ErrorText>{demoErrorText}</PasswordInput.ErrorText>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
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
        <PasswordInput.Root disabled>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          disabled
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Disabled state", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        // Visibility trigger should also be disabled
        const visibilityTrigger = page.getByRole("button", {
          name: /show password|hide password/i,
        })
        await expect.element(visibilityTrigger).toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root required>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          label={demoLabel}
          placeholder={demoPlaceholder}
          required
        />
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
        <PasswordInput.Root defaultValue="readonly123" readOnly>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          defaultValue="readonly123"
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
        await expect.element(input).toHaveValue("readonly123")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root size="sm">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          label={demoLabel}
          placeholder={demoPlaceholder}
          size="sm"
        />
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
        <PasswordInput.Root size="lg">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          label={demoLabel}
          placeholder={demoPlaceholder}
          size="lg"
        />
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
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <InputStartIcon icon={KeyRound} />
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          label={demoLabel}
          placeholder={demoPlaceholder}
          startIcon={KeyRound}
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
        <PasswordInput.Root defaultValue="password123">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger
              data-test-id={testIds.visibilityTrigger}
            />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          defaultValue="password123"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Password visibility toggle", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        const visibilityTrigger = page.getByRole("button", {
          name: /Show password|Hide password/i,
        })

        // Initially password should be hidden (type="password")
        await expect.element(input).toHaveAttribute("type", "password")
        await expect.element(visibilityTrigger).toBeVisible()

        // Click visibility trigger to show password
        await visibilityTrigger.click()
        await expect.element(input).toHaveAttribute("type", "text")

        // Click again to hide password
        await visibilityTrigger.click()
        await expect.element(input).toHaveAttribute("type", "password")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root autoComplete="new-password">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          autoComplete="new-password"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("AutoComplete attribute", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect
          .element(input)
          .toHaveAttribute("autocomplete", "new-password")
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
          <PasswordInput.Root onValueChange={handleValueChange} value={value}>
            <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
            <PasswordInput.InputGroup>
              <PasswordInput.Input placeholder={demoPlaceholder} />
              <PasswordInput.VisibilityTrigger />
            </PasswordInput.InputGroup>
          </PasswordInput.Root>
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
          <PasswordInput
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
        await input.fill("test123")
        // Verify input value updated
        await expect.element(input).toHaveValue("test123")
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [value, setValue] = useState("initial123")
        return (
          <div>
            <PasswordInput.Root onValueChange={setValue} value={value}>
              <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
              <PasswordInput.InputGroup>
                <PasswordInput.Input placeholder={demoPlaceholder} />
                <PasswordInput.VisibilityTrigger />
              </PasswordInput.InputGroup>
            </PasswordInput.Root>
            <button onClick={() => setValue("updated456")}>Update</button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [value, setValue] = useState("initial123")
        return (
          <div>
            <PasswordInput
              label={demoLabel}
              onValueChange={setValue}
              placeholder={demoPlaceholder}
              value={value}
            />
            <button onClick={() => setValue("updated456")}>Update</button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Controlled value updates", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("initial123")
        await page.getByRole("button", {name: "Update"}).click()
        await expect.element(input).toHaveValue("updated456")
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [focused, setFocused] = useState(false)
        return (
          <div>
            <PasswordInput.Root onFocusChange={setFocused}>
              <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
              <PasswordInput.InputGroup>
                <PasswordInput.Input placeholder={demoPlaceholder} />
                <PasswordInput.VisibilityTrigger />
              </PasswordInput.InputGroup>
            </PasswordInput.Root>
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
            <PasswordInput
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
      const TestComponent = () => {
        const [visible, setVisible] = useState(false)
        return (
          <div>
            <PasswordInput.Root onVisibleChange={setVisible} visible={visible}>
              <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
              <PasswordInput.InputGroup>
                <PasswordInput.Input placeholder={demoPlaceholder} />
                <PasswordInput.VisibilityTrigger />
              </PasswordInput.InputGroup>
            </PasswordInput.Root>
            <div data-test-id="visibility-state">
              Visibility: {visible ? "visible" : "hidden"}
            </div>
            <button onClick={() => setVisible(!visible)}>
              Toggle Visibility
            </button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [visible, setVisible] = useState(false)
        return (
          <div>
            <PasswordInput
              label={demoLabel}
              onVisibleChange={setVisible}
              placeholder={demoPlaceholder}
              visible={visible}
            />
            <div data-test-id="visibility-state">
              Visibility: {visible ? "visible" : "hidden"}
            </div>
            <button onClick={() => setVisible(!visible)}>
              Toggle Visibility
            </button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Controlled visibility state", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        const visibilityState = page.getByTestId("visibility-state")
        const toggleButton = page.getByRole("button", {
          name: "Toggle Visibility",
        })

        await expect.element(input).toHaveAttribute("type", "password")
        await expect
          .element(visibilityState)
          .toHaveTextContent("Visibility: hidden")

        await toggleButton.click()
        await expect.element(input).toHaveAttribute("type", "text")
        await expect
          .element(visibilityState)
          .toHaveTextContent("Visibility: visible")

        await toggleButton.click()
        await expect.element(input).toHaveAttribute("type", "password")
        await expect
          .element(visibilityState)
          .toHaveTextContent("Visibility: hidden")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root
          className="custom-class"
          data-test-id="password-input-root"
          id="custom-id"
        >
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          className="custom-class"
          data-test-id="password-input-root"
          id="custom-id"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Root element props spreading", async () => {
        render(getComponent())
        const root = page.getByTestId("password-input-root")
        await expect.element(root).toBeVisible()
        await expect.element(root).toHaveClass("custom-class")
        await expect.element(root).toHaveAttribute("id", "custom-id")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input
              data-test-id="password-input-element"
              maxLength={50}
              minLength={8}
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
              placeholder={demoPlaceholder}
              title="Password requirements"
            />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          inputProps={
            {
              "data-test-id": "password-input-element",
              maxLength: 50,
              minLength: 8,
              pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}",
              title: "Password requirements",
            } as InputHTMLAttributes<HTMLInputElement>
          }
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Input element props spreading", async () => {
        render(getComponent())
        const input = page.getByTestId("password-input-element")
        await expect.element(input).toBeVisible()
        await expect.element(input).toHaveAttribute("maxlength", "50")
        await expect.element(input).toHaveAttribute("minlength", "8")
        await expect
          .element(input)
          .toHaveAttribute("pattern", "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}")
        await expect
          .element(input)
          .toHaveAttribute("title", "Password requirements")
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root>
          <PasswordInput.Label
            className="custom-label-class"
            id="custom-label-id"
          >
            {demoLabel}
          </PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
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
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
          <PasswordInput.Hint className="custom-hint-class" id="custom-hint-id">
            {demoHint}
          </PasswordInput.Hint>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
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
        <PasswordInput.Root invalid>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
          <PasswordInput.ErrorText
            className="custom-error-class"
            data-test-id="error-text"
          >
            {demoErrorText}
          </PasswordInput.ErrorText>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
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
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger
              className="custom-visibility-class"
              data-test-id="visibility-trigger"
            />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          label={demoLabel}
          placeholder={demoPlaceholder}
          visibilityTriggerProps={
            {
              className: "custom-visibility-class",
              "data-test-id": "visibility-trigger",
            } as HTMLAttributes<HTMLElement>
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("Visibility trigger props spreading", async () => {
        render(getComponent())
        const visibilityTrigger = page.getByTestId("visibility-trigger")
        await expect.element(visibilityTrigger).toBeVisible()
        await expect
          .element(visibilityTrigger)
          .toHaveClass("custom-visibility-class")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root form="custom-form" name="custom-password">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          form="custom-form"
          label={demoLabel}
          name="custom-password"
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Form-related props spreading", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("name", "custom-password")
        await expect.element(input).toHaveAttribute("form", "custom-form")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root autoComplete="new-password">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          autoComplete="new-password"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("AutoComplete prop spreading", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect
          .element(input)
          .toHaveAttribute("autocomplete", "new-password")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root>
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input
              aria-describedby="custom-description"
              data-custom="custom-value"
              placeholder={demoPlaceholder}
              role="textbox"
            />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          inputProps={
            {
              "aria-describedby": "custom-description",
              "data-custom": "custom-value",
              role: "textbox",
            } as HTMLAttributes<HTMLElement>
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
        <PasswordInput.Root defaultValue="default123">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              placeholder={demoPlaceholder}
              spellCheck="false"
            />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          autoComplete="current-password"
          defaultValue="default123"
          inputProps={{
            autoCapitalize: "none",
            autoCorrect: "off",
            spellCheck: "false",
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
        await expect.element(input).toHaveValue("default123")
        await expect.element(input).toHaveAttribute("autocapitalize", "none")
        await expect
          .element(input)
          .toHaveAttribute("autocomplete", "current-password")
        await expect.element(input).toHaveAttribute("autocorrect", "off")
        await expect.element(input).toHaveAttribute("spellcheck", "false")
      })
    },
  },
  {
    composite() {
      return (
        <PasswordInput.Root defaultValue="test123">
          <PasswordInput.Label>{demoLabel}</PasswordInput.Label>
          <PasswordInput.InputGroup>
            <PasswordInput.Input placeholder={demoPlaceholder} />
            <PasswordInput.ClearTrigger />
            <PasswordInput.VisibilityTrigger />
          </PasswordInput.InputGroup>
        </PasswordInput.Root>
      )
    },
    simple() {
      return (
        <PasswordInput
          clearable
          defaultValue="test123"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Clearable prop functionality", async () => {
        render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("test123")

        // Clear button should be present when there's a value
        const clearButton = page.getByRole("button", {name: /Clear input/i})
        await expect.element(clearButton).toBeVisible()

        // Click clear button should clear the input
        await clearButton.click()
        await expect.element(input).toHaveValue("")
      })
    },
  },
]

const allTests: MultiComponentTestCase[] = [...tests, ...controlledStateTests]

describe("PasswordInput", () => {
  runTests(allTests)
})
