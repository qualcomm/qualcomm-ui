import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const seeded = parseDate("2024-06-15")

const trailingLabel = "After the picker"

const trailing = `<button type="button">${trailingLabel}</button>`

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
    ${trailing}
  `
}

function simpleTemplate(rootAttrs = "") {
  return `
    <q-date-picker
      label="Departure date"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    />
    ${trailing}
  `
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {
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
    protected readonly seeded = seeded
  }
  return SimpleComponent
}

const grid = () => page.getByRole("grid")
const input = () => page.getByRole("textbox")
const trailingButton = () => page.getByRole("button", {name: trailingLabel})
const focusedCell = () =>
  page.getByRole("button", {exact: false, name: /June 15, 2024/})

const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Tab from the calendar returns to the input instead of leaving the picker — ${component.name}`, async () => {
        await render(component)

        await openCalendar()
        await expect.element(focusedCell()).toHaveFocus()

        await userEvent.tab()

        await expect.element(input()).toHaveFocus()
        await expect.element(grid()).toBeVisible()
        await expect.element(trailingButton()).not.toHaveFocus()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Shift+Tab from the input returns to the calendar instead of dismissing it — ${component.name}`, async () => {
        await render(component)

        await openCalendar()
        await userEvent.tab()
        await expect.element(input()).toHaveFocus()

        await userEvent.tab({shift: true})

        await expect.element(focusedCell()).toHaveFocus()
        await expect.element(grid()).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`repeated Tab presses never reach content outside the picker — ${component.name}`, async () => {
        await render(component)

        await openCalendar()

        for (let i = 0; i < 8; i++) {
          await userEvent.tab()
          await expect.element(trailingButton()).not.toHaveFocus()
        }

        await expect.element(grid()).toBeVisible()
      })
    },
  },
  {
    composite: () => composite("openOnClick"),
    simple: () => simple("openOnClick"),
    testCase: (component) => {
      test(`opening from the input keeps focus in the input and still allows typing — ${component.name}`, async () => {
        await render(component)

        await input().click()
        await expect.element(grid()).toBeVisible()
        await expect.element(input()).toHaveFocus()

        await userEvent.keyboard("06/20/2024")

        await expect.element(input()).toHaveValue("06/20/2024")
        await expect.element(input()).toHaveFocus()
      })
    },
  },
]

describe("DatePicker - Focus trap", () => {
  runTests(tests)

  test("an inline calendar does not trap focus", async () => {
    @Component({
      imports: [DatePickerModule],
      template: `
        <q-date-picker
          label="Departure date"
          variant="inline"
          [defaultFocusedValue]="seeded"
        />
        <button type="button">After the picker</button>
      `,
    })
    class InlineComponent {
      protected readonly seeded = seeded
    }

    await render(InlineComponent)

    await focusedCell().click()
    await expect.element(focusedCell()).toHaveFocus()

    await userEvent.tab()

    await expect.element(trailingButton()).toHaveFocus()
  })
})
