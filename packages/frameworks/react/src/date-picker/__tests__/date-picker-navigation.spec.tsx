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
                <DatePicker.ViewTrigger view="month">
                  <DatePicker.MonthText />
                </DatePicker.ViewTrigger>
                <DatePicker.ViewTrigger view="year">
                  <DatePicker.YearText />
                </DatePicker.ViewTrigger>
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

const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()

const nextTrigger = () =>
  page.getByRole("button", {name: /switch to next month/i})
const prevTrigger = () =>
  page.getByRole("button", {name: /switch to previous month/i})

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the next trigger advances the visible month", async () => {
        await render(getComponent())
        await openCalendar()

        await nextTrigger().click()

        await expect
          .element(page.getByRole("gridcell", {name: /July 1, 2024/}))
          .toBeVisible()
        await expect
          .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
          .not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the previous trigger steps back across the year boundary", async () => {
        await render(getComponent())
        await openCalendar()

        for (let i = 0; i < 6; i++) {
          await prevTrigger().click()
        }

        await expect
          .element(page.getByRole("gridcell", {name: /December 15, 2023/}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => (
      <Composite max={parseDate("2024-06-30")} min={parseDate("2024-06-01")} />
    ),
    simple: () => (
      <Simple max={parseDate("2024-06-30")} min={parseDate("2024-06-01")} />
    ),
    testCase: (getComponent) => {
      test("both paging triggers are disabled when min and max fence the visible month in", async () => {
        await render(getComponent())
        await openCalendar()

        await expect.element(prevTrigger()).toBeDisabled()
        await expect.element(nextTrigger()).toBeDisabled()
      })
    },
  },
  {
    composite: () => <Composite max={parseDate("2024-07-31")} />,
    simple: () => <Simple max={parseDate("2024-07-31")} />,
    testCase: (getComponent) => {
      test("the next trigger disables only once the last allowed month is reached", async () => {
        await render(getComponent())
        await openCalendar()

        await expect.element(nextTrigger()).not.toBeDisabled()
        await nextTrigger().click()

        await expect.element(nextTrigger()).toBeDisabled()
        await expect.element(prevTrigger()).not.toBeDisabled()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("arrow keys page the visible month when focus crosses its edge", async () => {
        await render(getComponent())
        await openCalendar()

        // June 15 -> June 1 -> May 25
        await userEvent.keyboard("{Home}{ArrowUp}")

        await expect
          .element(page.getByRole("gridcell", {name: /May 25, 2024/}))
          .toBeVisible()
        await expect.element(page.getByLabelText(/May 25, 2024/)).toHaveFocus()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("PageDown and PageUp move focus a month at a time", async () => {
        await render(getComponent())
        await openCalendar()

        await userEvent.keyboard("{PageDown}")
        await expect.element(page.getByLabelText(/July 15, 2024/)).toHaveFocus()

        await userEvent.keyboard("{PageUp}")
        await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Shift+PageDown moves focus a year at a time", async () => {
        await render(getComponent())
        await openCalendar()

        await userEvent.keyboard("{Shift>}{PageDown}{/Shift}")

        await expect.element(page.getByLabelText(/June 15, 2025/)).toHaveFocus()
      })
    },
  },
  {
    composite: () => <Composite dir="rtl" />,
    simple: () => <Simple dir="rtl" />,
    testCase: (getComponent) => {
      test("arrow keys are mirrored in RTL", async () => {
        await render(getComponent())
        await openCalendar()

        await userEvent.keyboard("{ArrowRight}")
        await expect.element(page.getByLabelText(/June 14, 2024/)).toHaveFocus()

        await userEvent.keyboard("{ArrowLeft}")
        await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
      })
    },
  },
]

describe("DatePicker - Navigation", () => {
  runTests(tests)

  test("the paging triggers step by year in the month view and by decade in the year view", async () => {
    await render(<Simple />)
    await openCalendar()

    await page.getByRole("button", {name: /switch to month view/i}).click()
    await page.getByRole("button", {name: /switch to next year/i}).click()
    await expect
      .element(page.getByRole("button", {name: /switch to year view/i}))
      .toHaveTextContent("2025")

    await page.getByRole("button", {name: /return to calendar/i}).click()
    await page.getByRole("button", {name: /switch to year view/i}).click()
    await page.getByRole("button", {name: /switch to previous decade/i}).click()

    await expect
      .element(page.getByRole("gridcell", {name: "2010"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("gridcell", {name: "2019"}))
      .toBeVisible()
  })

  test("a range picker announces one visible month without repeating it", async () => {
    await render(<Simple selectionMode="range" />)
    await openCalendar()

    await nextTrigger().click()

    await expect
      .element(page.getByRole("status"))
      .toHaveTextContent(/^July 2024$/)
  })

  test("paging the day view announces the newly visible month", async () => {
    await render(<Simple />)
    await openCalendar()

    await nextTrigger().click()

    await expect
      .element(page.getByRole("status"))
      .toHaveTextContent("July 2024")
  })

  test("a visible range change is announced politely", async () => {
    await render(<Simple />)
    await openCalendar()

    await page.getByRole("button", {name: /switch to month view/i}).click()
    await page.getByRole("button", {name: /switch to next year/i}).click()

    await expect.element(page.getByRole("status")).toHaveTextContent("2025")
  })

  test("onVisibleRangeChange reports the newly visible month", async () => {
    const onVisibleRangeChange = vi.fn()
    await render(<Simple onVisibleRangeChange={onVisibleRangeChange} />)
    await openCalendar()

    await nextTrigger().click()

    expect(onVisibleRangeChange).toHaveBeenCalledWith(
      expect.objectContaining({
        visibleRange: expect.objectContaining({
          start: expect.objectContaining({month: 7, year: 2024}),
        }),
      }),
    )
  })

  test("onFocusChange reports roving focus without committing a value", async () => {
    const onFocusChange = vi.fn()
    const onValueChange = vi.fn()
    await render(
      <Simple onFocusChange={onFocusChange} onValueChange={onValueChange} />,
    )
    await openCalendar()

    await userEvent.keyboard("{ArrowRight}")

    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({
        focusedValue: expect.objectContaining({
          day: 16,
          month: 6,
          year: 2024,
        }),
      }),
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
