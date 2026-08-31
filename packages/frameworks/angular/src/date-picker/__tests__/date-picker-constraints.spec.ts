import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {
  DatePickerModule,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/angular/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const seeded = parseDate("2024-06-15")

const weekends = (date: DateValue) => {
  const weekday = new Date(date.year, date.month - 1, date.day).getDay()
  return weekday === 0 || weekday === 6
}

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

function inlineTemplate(rootAttrs = "") {
  return `<q-date-picker label="Departure date" variant="inline" ${rootAttrs} />`
}

function selectedUnavailableTemplate() {
  return `
    <q-date-picker
      label="Departure date"
      [closeOnSelect]="false"
      [defaultFocusedValue]="seeded"
      [defaultValue]="[seeded]"
      [isDateUnavailable]="weekends"
    />
  `
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {
    readonly valueChangedHandler = output()
    protected readonly beyondMax = [parseDate("2024-06-25")]
    protected readonly max = parseDate("2024-06-20")
    protected readonly min = parseDate("2024-06-10")
    protected readonly seeded = seeded
    protected readonly weekends = weekends
  }
  return CompositeComponent
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {
    readonly valueChangedHandler = output()
    protected readonly beyondMax = [parseDate("2024-06-25")]
    protected readonly max = parseDate("2024-06-20")
    protected readonly min = parseDate("2024-06-10")
    protected readonly seeded = seeded
    protected readonly weekends = weekends
  }
  return SimpleComponent
}

function inlineSimple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: inlineTemplate(rootAttrs),
  })
  class InlineComponent {
    protected readonly february = parseDate("2021-02-01")
    protected readonly seeded = seeded
  }
  return InlineComponent
}

function selectedUnavailable() {
  @Component({
    imports: [DatePickerModule],
    template: selectedUnavailableTemplate(),
  })
  class SelectedUnavailableComponent {
    protected readonly seeded = seeded
    protected readonly weekends = weekends
  }
  return SelectedUnavailableComponent
}

const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()

const dayCell = (day: RegExp) => page.getByRole("gridcell", {name: day})

/** Cell state and focus live on the trigger inside the `gridcell`. */
const dayTrigger = (day: string) => page.getByLabelText(day)

/**
 * `getByLabelText` pierces the hidden closed calendar, so data attributes on
 * cells must only be read once the grid is actually exposed.
 */
const expectGridVisible = () =>
  expect.element(page.getByRole("grid")).toBeVisible()

const weekdayNames = () =>
  Array.from(page.getByRole("grid").element().querySelectorAll("thead th")).map(
    (cell) => cell.getAttribute("aria-label"),
  )

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(`[max]="max" [min]="min"`),
    simple: () => simple(`[max]="max" [min]="min"`),
    testCase: (component) => {
      test(`days outside min and max are marked unselectable — ${component.name}`, async () => {
        await render(component)
        await openCalendar()
        await expectGridVisible()

        await expect
          .element(dayCell(/June 9, 2024/))
          .toHaveAttribute("aria-disabled", "true")
        await expect
          .element(dayCell(/June 21, 2024/))
          .toHaveAttribute("aria-disabled", "true")
        await expect
          .element(dayCell(/June 10, 2024/))
          .toHaveAttribute("aria-disabled", "false")
        await expect
          .element(dayCell(/June 20, 2024/))
          .toHaveAttribute("aria-disabled", "false")
      })
    },
  },
  {
    composite: () =>
      composite(
        `[max]="max" [min]="min" (valueChanged)="valueChangedHandler.emit()"`,
      ),
    simple: () =>
      simple(
        `[max]="max" [min]="min" (valueChanged)="valueChangedHandler.emit()"`,
      ),
    testCase: (component) => {
      test(`clicking a day outside min and max selects nothing — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {
            valueChangedHandler: () => {
              valueChanged()
            },
          },
        })
        await openCalendar()
        await expectGridVisible()

        // Playwright refuses to click `aria-disabled` targets, so the
        // component's own guard has to be exercised with a native click.
        const cell = dayTrigger("June 25, 2024").element() as HTMLElement
        cell.click()

        expect(valueChanged).not.toHaveBeenCalled()
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () =>
      composite(
        `[isDateUnavailable]="weekends" (valueChanged)="valueChangedHandler.emit()"`,
      ),
    simple: () =>
      simple(
        `[isDateUnavailable]="weekends" (valueChanged)="valueChangedHandler.emit()"`,
      ),
    testCase: (component) => {
      test(`unavailable days announce themselves and reject clicks — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {
            valueChangedHandler: () => {
              valueChanged()
            },
          },
        })
        await openCalendar()
        await expectGridVisible()

        // June 16 2024 is a Sunday
        await expect
          .element(dayTrigger("June 16, 2024"))
          .toHaveAttribute(
            "aria-label",
            expect.stringContaining("Not available"),
          )
        await expect
          .element(dayTrigger("June 16, 2024"))
          .toHaveAttribute("data-unavailable")

        const sunday = dayTrigger("June 16, 2024").element() as HTMLElement
        sunday.click()
        expect(valueChanged).not.toHaveBeenCalled()

        await dayCell(/June 17, 2024/).click()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/17/2024")
      })
    },
  },
  {
    composite: () => composite(`[isDateUnavailable]="weekends"`),
    simple: () => simple(`[isDateUnavailable]="weekends"`),
    testCase: (component) => {
      test(`Space on an unavailable day does not commit it — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        // June 15 2024 is a Saturday, and is the day the calendar opens on
        await expect.element(dayTrigger("June 15, 2024")).toHaveFocus()
        await userEvent.keyboard("{ }")

        await expect.element(page.getByRole("textbox")).toHaveValue("")
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(`[isDateUnavailable]="weekends"`),
    simple: () => simple(`[isDateUnavailable]="weekends"`),
    testCase: (component) => {
      test(`Enter on an unavailable day does not commit it — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        // June 15 2024 is a Saturday, and is the day the calendar opens on
        await expect.element(dayTrigger("June 15, 2024")).toHaveFocus()
        await userEvent.keyboard("{Enter}")

        await expect.element(page.getByRole("textbox")).toHaveValue("")
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(`[isDateUnavailable]="weekends"`),
    simple: () => simple(`[isDateUnavailable]="weekends"`),
    testCase: (component) => {
      test(`typing an unavailable date reverts the input to the last committed value — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("textbox")
        await input.fill("06/17/2024")
        await userEvent.keyboard("{Enter}")
        await expect.element(input).toHaveValue("06/17/2024")

        await input.fill("06/16/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("06/17/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`days spilling in from the neighbouring months are not selectable by default — ${component.name}`, async () => {
        await render(component)
        await openCalendar()
        await expectGridVisible()

        // June 2024 starts on a Saturday, so late May fills the first row
        await expect
          .element(dayTrigger("May 26, 2024"))
          .toHaveAttribute("data-outside-range")
        await expect
          .element(dayCell(/May 26, 2024/))
          .toHaveAttribute("aria-disabled", "true")
      })
    },
  },
  {
    composite: () => composite(`outsideDaySelectable`),
    simple: () => simple(`outsideDaySelectable`),
    testCase: (component) => {
      test(`outsideDaySelectable lets a spilled-in day be picked — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await dayCell(/May 26, 2024/).click()

        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("05/26/2024")
      })
    },
  },
  {
    composite: () => composite(`[defaultValue]="beyondMax" [max]="max"`),
    simple: () => simple(`[defaultValue]="beyondMax" [max]="max"`),
    testCase: (component) => {
      test(`a defaultValue beyond max is pulled back to max — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
]

describe("DatePicker - Constraints", () => {
  runTests(tests)

  test("today's cell is flagged for assistive tech", async () => {
    await render(inlineSimple())
    await expectGridVisible()

    const grid = page.getByRole("grid").element()
    const today = grid.querySelectorAll('[aria-current="date"]')

    expect(today).toHaveLength(1)
    expect(today[0].querySelector("[data-today]")).not.toBeNull()
  })

  test("an unavailable day that is also selected still reads as unavailable", async () => {
    await render(selectedUnavailable())
    await openCalendar()
    await expectGridVisible()

    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("aria-label", expect.stringContaining("Not available"))
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-selected")
  })

  test("fixedWeeks always renders six week rows", async () => {
    // February 2021 fits in exactly four rows without padding
    await render(inlineSimple(`fixedWeeks [defaultFocusedValue]="february"`))

    await expectGridVisible()
    expect(
      page.getByRole("grid").element().querySelectorAll("tbody tr"),
    ).toHaveLength(6)
  })

  test("the weekday header starts on Sunday by default", async () => {
    await render(inlineSimple(`[defaultFocusedValue]="seeded"`))
    await expectGridVisible()

    expect(weekdayNames()).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
  })

  test("startOfWeek shifts the weekday header order", async () => {
    await render(inlineSimple(`startOfWeek="1" [defaultFocusedValue]="seeded"`))
    await expectGridVisible()

    expect(weekdayNames()).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
  })
})
