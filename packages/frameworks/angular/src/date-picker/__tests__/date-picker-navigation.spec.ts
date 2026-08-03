import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"
import type {
  DatePickerFocusChangeDetails,
  DatePickerVisibleRangeChangeDetails,
} from "@qualcomm-ui/core/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const seeded = parseDate("2024-06-15")

function compositeTemplate(rootAttrs = "") {
  return `
    <div q-date-picker-root [defaultFocusedValue]="seeded" ${rootAttrs}>
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group></div>
      </div>
      <ng-template qPortal>
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            <div q-date-picker-view view="day">
              <div q-date-picker-view-control>
                <button q-date-picker-view-trigger view="month">
                  <q-date-picker-month-text />
                </button>
                <button q-date-picker-view-trigger view="year">
                  <q-date-picker-year-text />
                </button>
                <button q-date-picker-prev-trigger></button>
                <button q-date-picker-next-trigger></button>
              </div>
              <table q-date-picker-table>
                <thead q-date-picker-day-grid-header></thead>
                <tbody q-date-picker-day-grid></tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `
}

function simpleTemplate(rootAttrs = "") {
  return `
    <q-date-picker
      label="Departure date"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    />
  `
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {
    readonly focusChangedHandler = output<DatePickerFocusChangeDetails>()
    readonly valueChangedHandler = output()
    readonly visibleRangeChangedHandler =
      output<DatePickerVisibleRangeChangeDetails>()
    protected readonly max = parseDate("2024-06-30")
    protected readonly maxNextMonth = parseDate("2024-07-31")
    protected readonly min = parseDate("2024-06-01")
    protected readonly seeded = seeded
  }
  return CompositeComponent
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {
    readonly focusChangedHandler = output<DatePickerFocusChangeDetails>()
    readonly valueChangedHandler = output()
    readonly visibleRangeChangedHandler =
      output<DatePickerVisibleRangeChangeDetails>()
    protected readonly max = parseDate("2024-06-30")
    protected readonly maxNextMonth = parseDate("2024-07-31")
    protected readonly min = parseDate("2024-06-01")
    protected readonly seeded = seeded
  }
  return SimpleComponent
}

const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

const nextTrigger = () =>
  page.getByRole("button", {name: /switch to next month/i})
const prevTrigger = () =>
  page.getByRole("button", {name: /switch to previous month/i})

async function openCalendarAndWaitForFocus() {
  await openCalendar()
  await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
}

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the next trigger advances the visible month — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the previous trigger steps back across the year boundary — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(`[max]="max" [min]="min"`),
    simple: () => simple(`[max]="max" [min]="min"`),
    testCase: (component) => {
      test(`both paging triggers are disabled when min and max fence the visible month in — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await expect.element(prevTrigger()).toBeDisabled()
        await expect.element(nextTrigger()).toBeDisabled()
      })
    },
  },
  {
    composite: () => composite(`[max]="maxNextMonth"`),
    simple: () => simple(`[max]="maxNextMonth"`),
    testCase: (component) => {
      test(`the next trigger disables only once the last allowed month is reached — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await expect.element(nextTrigger()).not.toBeDisabled()
        await nextTrigger().click()

        await expect.element(nextTrigger()).toBeDisabled()
        await expect.element(prevTrigger()).not.toBeDisabled()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`arrow keys page the visible month when focus crosses its edge — ${component.name}`, async () => {
        await render(component)
        await openCalendarAndWaitForFocus()

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
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`PageDown and PageUp move focus a month at a time — ${component.name}`, async () => {
        await render(component)
        await openCalendarAndWaitForFocus()

        await userEvent.keyboard("{PageDown}")
        await expect.element(page.getByLabelText(/July 15, 2024/)).toHaveFocus()

        await userEvent.keyboard("{PageUp}")
        await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Shift+PageDown moves focus a year at a time — ${component.name}`, async () => {
        await render(component)
        await openCalendarAndWaitForFocus()

        await userEvent.keyboard("{Shift>}{PageDown}{/Shift}")

        await expect.element(page.getByLabelText(/June 15, 2025/)).toHaveFocus()
      })
    },
  },
  {
    composite: () => composite(`dir="rtl"`),
    simple: () => simple(`dir="rtl"`),
    testCase: (component) => {
      test(`arrow keys are mirrored in RTL — ${component.name}`, async () => {
        await render(component)
        await openCalendarAndWaitForFocus()

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
    await render(simple())
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
    await render(simple(`selectionMode="range"`))
    await openCalendar()

    await nextTrigger().click()

    await expect
      .element(page.getByRole("status"))
      .toHaveTextContent(/^July 2024$/)
  })

  test("paging the day view announces the newly visible month", async () => {
    await render(simple())
    await openCalendar()

    await nextTrigger().click()

    await expect
      .element(page.getByRole("status"))
      .toHaveTextContent("July 2024")
  })

  test("a visible range change is announced politely", async () => {
    await render(simple())
    await openCalendar()

    await page.getByRole("button", {name: /switch to month view/i}).click()
    await page.getByRole("button", {name: /switch to next year/i}).click()

    await expect.element(page.getByRole("status")).toHaveTextContent("2025")
  })

  test("visibleRangeChanged reports the newly visible month", async () => {
    const visibleRangeChanged = vi.fn()
    await render(
      simple(`(visibleRangeChanged)="visibleRangeChangedHandler.emit($event)"`),
      {
        on: {
          visibleRangeChangedHandler: (details) => {
            visibleRangeChanged(details)
          },
        },
      },
    )
    await openCalendar()

    await nextTrigger().click()

    await expect
      .poll(() => visibleRangeChanged)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          visibleRange: expect.objectContaining({
            start: expect.objectContaining({month: 7, year: 2024}),
          }),
        }),
      )
  })

  test("focusChanged reports roving focus without committing a value", async () => {
    const focusChanged = vi.fn()
    const valueChanged = vi.fn()
    await render(
      simple(`
        (focusChanged)="focusChangedHandler.emit($event)"
        (valueChanged)="valueChangedHandler.emit()"
      `),
      {
        on: {
          focusChangedHandler: (details) => {
            focusChanged(details)
          },
          valueChangedHandler: () => {
            valueChanged()
          },
        },
      },
    )
    await openCalendarAndWaitForFocus()

    await userEvent.keyboard("{ArrowRight}")

    await expect
      .poll(() => focusChanged)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          focusedValue: expect.objectContaining({
            day: 16,
            month: 6,
            year: 2024,
          }),
        }),
      )
    expect(valueChanged).not.toHaveBeenCalled()
  })
})
