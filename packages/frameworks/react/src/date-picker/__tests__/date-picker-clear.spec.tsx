import {afterEach, describe, expect, test, vi} from "vitest"
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

const clearTrigger = () =>
  page.getByRole("button", {name: /clear selected dates/i})

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the clear trigger is hidden while nothing is selected", async () => {
        await render(getComponent())
        await expect.element(clearTrigger()).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: (props) => <Composite defaultValue={[seeded]} {...props} />,
    simple: (props) => <Simple defaultValue={[seeded]} {...props} />,
    testCase: (getComponent) => {
      test("the clear trigger empties the field and reports the cleared value", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        await expect.element(clearTrigger()).toBeVisible()
        await clearTrigger().click()

        await expect.element(page.getByRole("textbox")).toHaveValue("")
        expect(onValueChange).toHaveBeenCalledWith(
          expect.objectContaining({value: [], valueAsString: []}),
        )
        await expect.element(clearTrigger()).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: (props) => <Composite defaultValue={[seeded]} {...props} />,
    simple: (props) => <Simple defaultValue={[seeded]} {...props} />,
    testCase: (getComponent) => {
      test("clearing moves focus to the input", async () => {
        await render(getComponent())

        await clearTrigger().click()

        await expect.element(page.getByRole("textbox")).toHaveFocus()
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[seeded]} disabled {...props} />
    ),
    simple: (props) => <Simple defaultValue={[seeded]} disabled {...props} />,
    testCase: (getComponent) => {
      test("the clear trigger is disabled alongside the picker", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        await expect.element(clearTrigger()).toBeDisabled()
        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: (props) => (
      <Composite
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        selectionMode="range"
        {...props}
      />
    ),
    simple: (props) => (
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        selectionMode="range"
        {...props}
      />
    ),
    testCase: (getComponent) => {
      test("the clear trigger empties both ends of a range", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        await clearTrigger().click()

        await expect
          .element(page.getByRole("textbox", {name: /start date/i}))
          .toHaveValue("")
        await expect
          .element(page.getByRole("textbox", {name: /end date/i}))
          .toHaveValue("")
        expect(onValueChange).toHaveBeenCalledWith(
          expect.objectContaining({value: [], valueAsString: []}),
        )
      })
    },
  },
]

describe("DatePicker - Clear", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  runTests(tests)

  test("a readOnly picker keeps the clear trigger inert", async () => {
    const onValueChange = vi.fn()
    await render(
      <Simple defaultValue={[seeded]} onValueChange={onValueChange} readOnly />,
    )

    await clearTrigger().click()

    await expect.element(page.getByRole("textbox")).toHaveValue("06/15/2024")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("pressing Enter in a cleared input keeps it empty", async () => {
    await render(<Simple defaultValue={[parseDate("2024-06-10")]} />)

    const input = page.getByRole("textbox")
    await input.fill("06/20/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(input).toHaveValue("06/20/2024")

    await clearTrigger().click()
    await expect.element(input).toHaveValue("")

    await userEvent.click(input.element())
    await userEvent.keyboard("{Enter}")

    await expect.element(input).toHaveValue("")
  })

  test("clearing while the calendar is open resets the focused day to today", async () => {
    vi.setSystemTime(new Date("2026-07-29T12:00:00Z"))
    await render(
      <Simple closeOnSelect={false} defaultValue={[seeded]} timeZone="UTC" />,
    )
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await clearTrigger().click()

    await expect.element(page.getByRole("textbox")).toHaveValue("")
    await expect
      .element(page.getByLabelText(/July 29, 2026/))
      .toHaveAttribute("data-today")
    await expect
      .element(page.getByLabelText(/July 29, 2026/))
      .toHaveAttribute("data-focus")
  })
})
