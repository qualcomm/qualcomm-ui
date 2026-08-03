import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"
import type {DatePickerViewChangeDetails} from "@qualcomm-ui/core/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const seeded = parseDate("2024-06-15")

function subView(view: "month" | "year") {
  return `
    <div q-date-picker-view view="${view}">
      <div q-date-picker-view-control>
        <button q-date-picker-prev-trigger></button>
        <button q-date-picker-next-trigger></button>
        <button q-date-picker-view-close-trigger></button>
      </div>
      <table q-date-picker-table>
        <tbody q-date-picker-${view}-grid></tbody>
      </table>
    </div>
  `
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
            ${subView("month")}
            ${subView("year")}
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

/**
 * A trigger with no `view` cycles instead of jumping; that is what `maxView`
 * clamps.
 */
function cyclingTemplate(rootAttrs = "") {
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
                <button q-date-picker-view-trigger>
                  <q-date-picker-month-text />
                </button>
              </div>
              <table q-date-picker-table>
                <thead q-date-picker-day-grid-header></thead>
                <tbody q-date-picker-day-grid></tbody>
              </table>
            </div>
            <div q-date-picker-view view="month">
              <div q-date-picker-view-control>
                <button q-date-picker-view-trigger>
                  <q-date-picker-year-text />
                </button>
              </div>
              <table q-date-picker-table>
                <tbody q-date-picker-month-grid></tbody>
              </table>
            </div>
            <div q-date-picker-view view="year">
              <div q-date-picker-view-control>
                <button q-date-picker-view-trigger></button>
              </div>
              <table q-date-picker-table>
                <tbody q-date-picker-year-grid></tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `
}

function minMonthViewTriggersTemplate() {
  return `
    <div inline minView="month" q-date-picker-root [defaultFocusedValue]="seeded">
      <div q-date-picker-content>
        <div q-date-picker-view view="month">
          <div q-date-picker-view-control>
            <button q-date-picker-view-trigger view="day">Days</button>
            <button q-date-picker-view-trigger view="year">Years</button>
          </div>
          <table q-date-picker-table>
            <tbody q-date-picker-month-grid></tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

function minMonthViewCloseTemplate() {
  return `
    <div inline minView="month" q-date-picker-root [defaultFocusedValue]="seeded">
      <div q-date-picker-content>
        <div q-date-picker-view view="month">
          <div q-date-picker-view-control>
            <button q-date-picker-view-trigger view="year">Years</button>
            <button q-date-picker-view-close-trigger></button>
          </div>
          <table q-date-picker-table>
            <tbody q-date-picker-month-grid></tbody>
          </table>
        </div>
        ${subView("year")}
      </div>
    </div>
  `
}

function maxMonthWithApiTemplate() {
  return `
    <div inline maxView="month" q-date-picker-root [defaultFocusedValue]="seeded">
      <ng-container *datePickerContext="let api">
        <button type="button" (click)="api.setView('year')">Go year</button>
      </ng-container>
      <div q-date-picker-content>
        <div q-date-picker-view view="day">
          <table q-date-picker-table>
            <thead q-date-picker-day-grid-header></thead>
            <tbody q-date-picker-day-grid></tbody>
          </table>
        </div>
        ${subView("month")}
        ${subView("year")}
      </div>
    </div>
  `
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {
    readonly valueChangedHandler = output()
    readonly viewChangedHandler = output<DatePickerViewChangeDetails>()
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
    readonly valueChangedHandler = output()
    readonly viewChangedHandler = output<DatePickerViewChangeDetails>()
    protected readonly seeded = seeded
  }
  return SimpleComponent
}

function cyclingComposite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: cyclingTemplate(rootAttrs),
  })
  class CyclingComponent {
    protected readonly seeded = seeded
  }
  return CyclingComponent
}

function minMonthViewTriggers() {
  @Component({
    imports: [DatePickerModule],
    template: minMonthViewTriggersTemplate(),
  })
  class MinMonthViewTriggersComponent {
    protected readonly seeded = seeded
  }
  return MinMonthViewTriggersComponent
}

function minMonthViewClose() {
  @Component({
    imports: [DatePickerModule],
    template: minMonthViewCloseTemplate(),
  })
  class MinMonthViewCloseComponent {
    protected readonly seeded = seeded
  }
  return MinMonthViewCloseComponent
}

function maxMonthWithApi() {
  @Component({
    imports: [DatePickerModule],
    template: maxMonthWithApiTemplate(),
  })
  class MaxMonthWithApiComponent {
    protected readonly seeded = seeded
  }
  return MaxMonthWithApiComponent
}

const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

const grid = () => page.getByRole("grid")

const dayLevel = "calendar month"
const monthLevel = "calendar year"
const yearLevel = "calendar decade"

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the month view trigger switches from the day grid to the month grid — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the year view trigger switches from the day grid to the year grid — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(`(valueChanged)="valueChangedHandler.emit()"`),
    simple: () => simple(`(valueChanged)="valueChangedHandler.emit()"`),
    testCase: (component) => {
      test(`picking a month returns to the day grid on that month — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {
            valueChangedHandler: () => {
              valueChanged()
            },
          },
        })
        await openCalendar()

        await page.getByRole("button", {name: /switch to month view/i}).click()
        await page.getByRole("gridcell", {name: "September"}).click()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)
        await expect
          .element(page.getByRole("gridcell", {name: /September 15, 2024/}))
          .toBeVisible()
        expect(valueChanged).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`viewOnSelect defaults to jumping straight from the year grid to the day grid — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(`viewOnSelect="previous"`),
    simple: () => simple(`viewOnSelect="previous"`),
    testCase: (component) => {
      test(`viewOnSelect='previous' steps the year grid back one level to the month grid — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the view close trigger abandons the month grid and returns to the day grid — ${component.name}`, async () => {
        await render(component)
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
    composite: () => composite(`(valueChanged)="valueChangedHandler.emit()"`),
    simple: () => simple(`(valueChanged)="valueChangedHandler.emit()"`),
    testCase: (component) => {
      test(`Enter drills down from the year grid without committing a value — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {
            valueChangedHandler: () => {
              valueChanged()
            },
          },
        })
        await openCalendar()

        await page.getByRole("button", {name: /switch to year view/i}).click()
        // Enter is handled by the focused year cell, so roving focus has to
        // land there before the key is pressed.
        await expect
          .element(page.getByRole("button", {exact: true, name: "2024"}))
          .toHaveFocus()
        await userEvent.keyboard("{Enter}")

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", dayLevel)
        expect(valueChanged).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => composite(`defaultView="year"`),
    simple: () => simple(`defaultView="year"`),
    testCase: (component) => {
      test(`defaultView opens at the requested level — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await expect
          .element(grid())
          .toHaveAttribute("aria-roledescription", yearLevel)
      })
    },
  },
]

describe("DatePicker - Views", () => {
  runTests(tests)

  test("a bare view trigger cycles day to month to year", async () => {
    await render(cyclingComposite())
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
    await render(cyclingComposite(`maxView="month"`))
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
    await render(cyclingComposite(`minView="month"`))
    await openCalendar()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)

    await page.getByRole("gridcell", {name: "September"}).click()

    await expect.element(page.getByRole("textbox")).toHaveValue("09/01/2024")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("maxView='month' disables a view trigger that targets the year grid", async () => {
    await render(composite(`maxView="month"`))
    await openCalendar()

    await expect
      .element(page.getByRole("button", {name: /switch to year view/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .not.toBeDisabled()
  })

  test("minView='month' disables a view trigger that targets the day grid", async () => {
    await render(minMonthViewTriggers())

    await expect
      .element(page.getByRole("button", {name: /switch to day view/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to year view/i}))
      .not.toBeDisabled()
  })

  test("the view close trigger returns to minView rather than to the day grid", async () => {
    await render(minMonthViewClose())

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
    await render(maxMonthWithApi())
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", dayLevel)

    await page.getByRole("button", {name: "Go year"}).click()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", monthLevel)
  })

  test("reopening discards uncommitted navigation, in both view and visible month", async () => {
    await render(simple())

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
    await render(simple(`[defaultValue]="[seeded]"`))

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

  test("viewChanged reports each level change", async () => {
    const viewChanged = vi.fn()
    await render(simple(`(viewChanged)="viewChangedHandler.emit($event)"`), {
      on: {
        viewChangedHandler: (details) => {
          viewChanged(details)
        },
      },
    })
    await openCalendar()

    await page.getByRole("button", {name: /switch to month view/i}).click()
    await expect.poll(() => viewChanged).toHaveBeenCalledWith({view: "month"})

    await page.getByRole("button", {name: /return to calendar/i}).click()
    await expect.poll(() => viewChanged).toHaveBeenCalledWith({view: "day"})
  })
})
