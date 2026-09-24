import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const seeded = parseDate("2024-06-15")

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root defaultFocusedValue={seeded} {...props}>
      <DatePicker.Control>
        <DatePicker.InputGroup label="Departure date" />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}

function Simple(props: Partial<DatePickerProps>) {
  return (
    <DatePicker
      defaultFocusedValue={seeded}
      label="Departure date"
      {...props}
    />
  )
}

const tests: MultiComponentTestCase[] = [
  {
    composite: () => <Composite disabled />,
    simple: () => <Simple disabled />,
    testCase: (getComponent) => {
      test("disabled prevents opening the calendar", async () => {
        await render(getComponent())

        await expect
          .element(page.getByRole("button", {name: /(?:choose|change) date/i}))
          .toBeDisabled()
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => <Composite defaultValue={[seeded]} readOnly />,
    simple: () => <Simple defaultValue={[seeded]} readOnly />,
    testCase: (getComponent) => {
      test("readOnly leaves the trigger enabled but does not open the popover", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {
          name: /(?:choose|change) date/i,
        })
        await expect.element(trigger).not.toBeDisabled()

        await trigger.click()
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
]

describe("DatePicker - States", () => {
  runTests(tests)

  test("readOnly inline calendar stays navigable but ignores selection", async () => {
    const onValueChange = vi.fn()
    await render(
      <DatePicker
        defaultFocusedValue={seeded}
        onValueChange={onValueChange}
        readOnly
        variant="inline"
      />,
    )

    await page.getByRole("gridcell", {name: /June 15, 2024/}).click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByLabelText(/June 16, 2024/)).toHaveFocus()

    await userEvent.keyboard("{Enter}")
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
