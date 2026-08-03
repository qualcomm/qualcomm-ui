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

function SubView(props: {view: "month" | "year"}) {
  return (
    <DatePicker.View view={props.view}>
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger />
        <DatePicker.NextTrigger />
        <DatePicker.ViewCloseTrigger />
      </DatePicker.ViewControl>
      <DatePicker.Table>
        {props.view === "month" ? (
          <DatePicker.MonthGrid />
        ) : (
          <DatePicker.YearGrid />
        )}
      </DatePicker.Table>
    </DatePicker.View>
  )
}

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
            <SubView view="month" />
            <SubView view="year" />
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
  page.getByRole("button", {name: /open calendar/i}).click()

/**
 * Only the active view is exposed to the a11y tree, so the single visible grid
 * identifies the current view.
 */
const grid = () => page.getByRole("grid")

const dayLevel = "calendar month"
const monthLevel = "calendar year"
const yearLevel = "calendar decade"

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the month view trigger switches from the day grid to the month grid", async () => {
        await render(getComponent())
        await openCalendar()
        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)

        await page.getByRole("button", {name: /switch to month view/i}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", monthLevel)
        await expect
          .element(page.getByRole("gridcell", {name: "July"}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the year view trigger switches from the day grid to the year grid", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("button", {name: /switch to year view/i}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", yearLevel)
        await expect
          .element(page.getByRole("gridcell", {name: "2020"}))
          .toBeVisible()
        await expect
          .element(page.getByRole("gridcell", {name: "2029"}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("picking a month returns to the day grid on that month", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))
        await openCalendar()

        await page.getByRole("button", {name: /switch to month view/i}).click()
        await page.getByRole("gridcell", {name: "September"}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)
        await expect
          .element(page.getByRole("gridcell", {name: /September 15, 2024/}))
          .toBeVisible()
        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("viewOnSelect defaults to jumping straight from the year grid to the day grid", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("button", {name: /switch to year view/i}).click()
        await page.getByRole("gridcell", {name: "2026"}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)
        await expect
          .element(page.getByRole("gridcell", {name: /June 15, 2026/}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite viewOnSelect="previous" />,
    simple: () => <Simple viewOnSelect="previous" />,
    testCase: (getComponent) => {
      test("viewOnSelect='previous' steps the year grid back one level to the month grid", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("button", {name: /switch to year view/i}).click()
        await page.getByRole("gridcell", {name: "2026"}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", monthLevel)
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the view close trigger abandons the month grid and returns to the day grid", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("button", {name: /switch to month view/i}).click()
        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", monthLevel)

        await page.getByRole("button", {name: /return to calendar/i}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)
        await expect
          .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Enter drills down from the year grid without committing a value", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))
        await openCalendar()

        await page.getByRole("button", {name: /switch to year view/i}).click()
        await userEvent.keyboard("{Enter}")

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)
        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => <Composite defaultView="year" />,
    simple: () => <Simple defaultView="year" />,
    testCase: (getComponent) => {
      test("defaultView opens at the requested level", async () => {
        await render(getComponent())
        await openCalendar()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", yearLevel)
      })
    },
  },
]

/**
 * A `ViewTrigger` without a `view` prop cycles to the next level rather than
 * jumping to a named one, which is the path `maxView` clamps.
 */
function CyclingComposite(props: Partial<DatePickerRootProps>) {
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
                <DatePicker.ViewTrigger>
                  <DatePicker.MonthText />
                </DatePicker.ViewTrigger>
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.ViewControl>
                <DatePicker.ViewTrigger>
                  <DatePicker.YearText />
                </DatePicker.ViewTrigger>
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.MonthGrid />
              </DatePicker.Table>
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.ViewControl>
                <DatePicker.ViewTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.YearGrid />
              </DatePicker.Table>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}

describe("DatePicker - Views", () => {
  runTests(tests)

  test("a bare view trigger cycles day to month to year", async () => {
    await render(<CyclingComposite />)
    await openCalendar()

    await page.getByRole("button", {name: /switch to year view/i}).click()
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)

    await page.getByRole("button", {name: /switch to day view/i}).click()
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", yearLevel)
  })

  test("maxView='month' stops the cycling view trigger at the month grid", async () => {
    await render(<CyclingComposite maxView="month" />)
    await openCalendar()

    await page.getByRole("button", {name: /switch to year view/i}).click()
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)

    await page.getByRole("button", {name: /switch to day view/i}).click()
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)
  })

  test("minView='month' makes a month click the selection, normalized to the first of the month", async () => {
    await render(<CyclingComposite minView="month" />)
    await openCalendar()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)

    await page.getByRole("gridcell", {name: "September"}).click()

    await expect.element(page.getByRole("textbox")).toHaveValue("09/01/2024")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("maxView='month' disables a view trigger that targets the year grid", async () => {
    await render(<Composite maxView="month" />)
    await openCalendar()

    await expect
      .element(page.getByRole("button", {name: /switch to year view/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .not.toBeDisabled()
  })

  test("minView='month' disables a view trigger that targets the day grid", async () => {
    await render(
      <DatePicker.Root defaultFocusedValue={seeded} inline minView="month">
        <DatePicker.Content>
          <DatePicker.View view="month">
            <DatePicker.ViewControl>
              <DatePicker.ViewTrigger view="day">Days</DatePicker.ViewTrigger>
              <DatePicker.ViewTrigger view="year">Years</DatePicker.ViewTrigger>
            </DatePicker.ViewControl>
            <DatePicker.Table>
              <DatePicker.MonthGrid />
            </DatePicker.Table>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>,
    )

    await expect
      .element(page.getByRole("button", {name: /switch to day view/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to year view/i}))
      .not.toBeDisabled()
  })

  test("the view close trigger returns to minView rather than to the day grid", async () => {
    await render(
      <DatePicker.Root defaultFocusedValue={seeded} inline minView="month">
        <DatePicker.Content>
          <DatePicker.View view="month">
            <DatePicker.ViewControl>
              <DatePicker.ViewTrigger view="year">Years</DatePicker.ViewTrigger>
              <DatePicker.ViewCloseTrigger />
            </DatePicker.ViewControl>
            <DatePicker.Table>
              <DatePicker.MonthGrid />
            </DatePicker.Table>
          </DatePicker.View>
          <SubView view="year" />
        </DatePicker.Content>
      </DatePicker.Root>,
    )

    await page.getByRole("button", {name: /switch to year view/i}).click()
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", yearLevel)

    await page.getByRole("button", {name: /return to calendar/i}).click()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)
  })

  test("setView clamps a request that falls outside minView and maxView", async () => {
    await render(
      <DatePicker.Root defaultFocusedValue={seeded} inline maxView="month">
        <DatePicker.Context>
          {(api) => (
            <button onClick={() => api.setView("year")}>Go year</button>
          )}
        </DatePicker.Context>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Table>
              <DatePicker.DayGridHeader />
              <DatePicker.DayGrid />
            </DatePicker.Table>
          </DatePicker.View>
          <SubView view="month" />
          <SubView view="year" />
        </DatePicker.Content>
      </DatePicker.Root>,
    )
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", dayLevel)

    await page.getByRole("button", {name: "Go year"}).click()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)
  })

  test("reopening discards uncommitted navigation, in both view and visible month", async () => {
    await render(<Simple />)

    await openCalendar()
    await page.getByRole("button", {name: /switch to month view/i}).click()
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)

    await page.getByRole("button", {name: /close calendar/i}).click()
    await openCalendar()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", dayLevel)
    await expect
      .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
      .toBeVisible()
  })

  test("reopening returns to the month of the committed value, not the last browsed month", async () => {
    await render(<Simple defaultValue={[seeded]} />)

    const monthHeading = () =>
      page.getByRole("button", {name: /switch to month view/i})

    await openCalendar()
    await page.getByRole("button", {name: /switch to next month/i}).click()
    await expect.element(monthHeading()).toHaveTextContent("July")

    await page.getByRole("button", {name: /close calendar/i}).click()
    await openCalendar()

    await expect.element(monthHeading()).toHaveTextContent("June")
    await expect
      .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
      .toBeVisible()
  })

  test("onViewChange reports each level change", async () => {
    const onViewChange = vi.fn()
    await render(<Simple onViewChange={onViewChange} />)
    await openCalendar()

    await page.getByRole("button", {name: /switch to month view/i}).click()
    expect(onViewChange).toHaveBeenCalledWith({view: "month"})

    await page.getByRole("button", {name: /return to calendar/i}).click()
    expect(onViewChange).toHaveBeenCalledWith({view: "day"})
  })
})
