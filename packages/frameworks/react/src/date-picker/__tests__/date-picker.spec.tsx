import {useState} from "react"

import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {
  DatePicker,
  DatePickerCalendar,
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerControls,
  DatePickerInput,
  DatePickerLabel,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRoot,
  DatePickerTodayTrigger,
  DatePickerTrigger,
  DatePickerViewTrigger,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const demoLabel = "Select Date"
const demoPlaceholder = "MM/DD/YYYY"
const demoHint = "Choose your preferred date"
const demoErrorText = "Date is required"

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <DatePickerRoot>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Label association and focus", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoLabel)).toBeVisible()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toHaveFocus()
      })
      test("Input and trigger visibility", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
        await expect.element(input).toHaveAttribute("type", "text")

        const trigger = page.getByRole("button", {name: "Toggle calendar"})
        await expect.element(trigger).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput placeholder={demoPlaceholder} />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} placeholder={demoPlaceholder} />
    },
    testCase: (getComponent) => {
      test("Placeholder attribute", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Calendar opens on trigger click", async () => {
        await render(getComponent())
        const trigger = page.getByRole("button", {name: "Toggle calendar"})
        await trigger.click()

        const calendar = page.getByRole("grid")
        await expect.element(calendar).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger>Today</DatePickerTodayTrigger>
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Today button is visible when calendar is open", async () => {
        await render(getComponent())
        const trigger = page.getByRole("button", {name: "Toggle calendar"})
        await trigger.click()

        const todayButton = page.getByRole("button", {name: "Go to today"})
        await expect.element(todayButton).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot disabled>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker disabled label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Disabled state", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()

        const trigger = page.getByRole("button", {name: "Toggle calendar"})
        await expect.element(trigger).toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot invalid>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker errorText={demoErrorText} invalid label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Error state and error text", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot readOnly>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} readOnly />
    },
    testCase: (getComponent) => {
      test("Read-only state", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("readonly")
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot required>
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} required />
    },
    testCase: (getComponent) => {
      test("Required state", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeRequired()
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot size="sm">
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} size="sm" />
    },
    testCase: (getComponent) => {
      test("Small size variant", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <DatePickerRoot size="lg">
          <DatePickerLabel>{demoLabel}</DatePickerLabel>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerControls>
                <DatePickerPrevTrigger />
                <DatePickerViewTrigger />
                <DatePickerNextTrigger />
              </DatePickerControls>
              <DatePickerCalendar />
              <DatePickerTodayTrigger />
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>
      )
    },
    simple() {
      return <DatePicker label={demoLabel} size="lg" />
    },
    testCase: (getComponent) => {
      test("Large size variant", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
      })
    },
  },
]

const controlledStateTests: MultiComponentTestCase[] = [
  {
    composite() {
      const TestComponent = () => {
        const [value, setValue] = useState<Date | null>(null)
        return (
          <div>
            <DatePickerRoot
              onValueChange={(details) => setValue(details.value)}
              value={value}
            >
              <DatePickerLabel>{demoLabel}</DatePickerLabel>
              <DatePickerInput />
              <DatePickerTrigger />
              <DatePickerPositioner>
                <DatePickerContent>
                  <DatePickerControls>
                    <DatePickerPrevTrigger />
                    <DatePickerViewTrigger />
                    <DatePickerNextTrigger />
                  </DatePickerControls>
                  <DatePickerCalendar />
                  <DatePickerTodayTrigger />
                </DatePickerContent>
              </DatePickerPositioner>
            </DatePickerRoot>
            {value && (
              <div data-testid="selected-value">{value.toISOString()}</div>
            )}
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [value, setValue] = useState<Date | null>(null)
        return (
          <div>
            <DatePicker
              label={demoLabel}
              onValueChange={(details) => setValue(details.value)}
              value={value}
            />
            {value && (
              <div data-testid="selected-value">{value.toISOString()}</div>
            )}
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Today button sets value", async () => {
        await render(getComponent())
        const trigger = page.getByRole("button", {name: "Toggle calendar"})
        await trigger.click()

        const todayButton = page.getByRole("button", {name: "Go to today"})
        await todayButton.click()

        await expect.element(page.getByTestId("selected-value")).toBeVisible()
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [value, setValue] = useState<Date | null>(new Date())
        return (
          <div>
            <DatePickerRoot
              onValueChange={(details) => setValue(details.value)}
              value={value}
            >
              <DatePickerLabel>{demoLabel}</DatePickerLabel>
              <DatePickerInput />
              <DatePickerClearTrigger />
              <DatePickerTrigger />
              <DatePickerPositioner>
                <DatePickerContent>
                  <DatePickerControls>
                    <DatePickerPrevTrigger />
                    <DatePickerViewTrigger />
                    <DatePickerNextTrigger />
                  </DatePickerControls>
                  <DatePickerCalendar />
                  <DatePickerTodayTrigger />
                </DatePickerContent>
              </DatePickerPositioner>
            </DatePickerRoot>
            {value && <div data-testid="has-value">Has value</div>}
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [value, setValue] = useState<Date | null>(new Date())
        return (
          <div>
            <DatePicker
              label={demoLabel}
              onValueChange={(details) => setValue(details.value)}
              value={value}
            />
            {value && <div data-testid="has-value">Has value</div>}
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Clear button clears value", async () => {
        await render(getComponent())
        await expect.element(page.getByTestId("has-value")).toBeVisible()

        const clearButton = page.getByRole("button", {name: "Clear value"})
        await clearButton.click()

        await expect
          .element(page.getByTestId("has-value"))
          .not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [value, setValue] = useState<Date | null>(new Date("2024-01-15"))
        return (
          <div>
            <DatePickerRoot
              onValueChange={(details) => setValue(details.value)}
              value={value}
            >
              <DatePickerLabel>{demoLabel}</DatePickerLabel>
              <DatePickerInput />
              <DatePickerTrigger />
              <DatePickerPositioner>
                <DatePickerContent>
                  <DatePickerControls>
                    <DatePickerPrevTrigger />
                    <DatePickerViewTrigger />
                    <DatePickerNextTrigger />
                  </DatePickerControls>
                  <DatePickerCalendar />
                  <DatePickerTodayTrigger />
                </DatePickerContent>
              </DatePickerPositioner>
            </DatePickerRoot>
            <button onClick={() => setValue(new Date("2024-12-25"))}>
              Update Date
            </button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [value, setValue] = useState<Date | null>(new Date("2024-01-15"))
        return (
          <div>
            <DatePicker
              label={demoLabel}
              onValueChange={(details) => setValue(details.value)}
              value={value}
            />
            <button onClick={() => setValue(new Date("2024-12-25"))}>
              Update Date
            </button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Controlled value updates", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("01/15/2024")

        await page.getByRole("button", {name: "Update Date"}).click()
        await expect.element(input).toHaveValue("12/25/2024")
      })
    },
  },
  {
    composite() {
      const TestComponent = () => {
        const [open, setOpen] = useState(false)
        return (
          <div>
            <DatePickerRoot onOpenChange={(details) => setOpen(details.open)} open={open}>
              <DatePickerLabel>{demoLabel}</DatePickerLabel>
              <DatePickerInput />
              <DatePickerTrigger />
              <DatePickerPositioner>
                <DatePickerContent>
                  <DatePickerControls>
                    <DatePickerPrevTrigger />
                    <DatePickerViewTrigger />
                    <DatePickerNextTrigger />
                  </DatePickerControls>
                  <DatePickerCalendar />
                  <DatePickerTodayTrigger />
                </DatePickerContent>
              </DatePickerPositioner>
            </DatePickerRoot>
            <div data-testid="open-state">
              Calendar: {open ? "open" : "closed"}
            </div>
            <button onClick={() => setOpen(!open)}>Toggle</button>
          </div>
        )
      }
      return <TestComponent />
    },
    simple() {
      const TestComponent = () => {
        const [open, setOpen] = useState(false)
        return (
          <div>
            <DatePicker
              label={demoLabel}
              onOpenChange={(details) => setOpen(details.open)}
              open={open}
            />
            <div data-testid="open-state">
              Calendar: {open ? "open" : "closed"}
            </div>
            <button onClick={() => setOpen(!open)}>Toggle</button>
          </div>
        )
      }
      return <TestComponent />
    },
    testCase: (getComponent) => {
      test("Controlled open state", async () => {
        await render(getComponent())
        const openState = page.getByTestId("open-state")
        const toggleButton = page.getByRole("button", {name: "Toggle"})

        await expect.element(openState).toHaveTextContent("Calendar: closed")

        await toggleButton.click()
        await expect.element(openState).toHaveTextContent("Calendar: open")

        const calendar = page.getByRole("grid")
        await expect.element(calendar).toBeVisible()
      })
    },
  },
]

const allTests: MultiComponentTestCase[] = [...tests, ...controlledStateTests]

describe("DatePicker", () => {
  runTests(allTests)
})
