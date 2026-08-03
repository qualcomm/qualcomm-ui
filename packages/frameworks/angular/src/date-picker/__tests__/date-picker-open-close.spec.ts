import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

/**
 * `booleanAttribute` maps `undefined` to `false`, so an unset boolean input has
 * to be left off the template rather than bound to `undefined`.
 */
function compositeTemplate(rootAttrs = "") {
  return `
    <div q-date-picker-root ${rootAttrs}>
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
  return `<q-date-picker label="Departure date" ${rootAttrs} />`
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {}
  return CompositeComponent
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {}
  return SimpleComponent
}

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`opens on trigger click and closes on Escape, restoring focus to the trigger — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()

        await page.getByRole("button", {name: /open calendar/i}).click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("button", {name: /open calendar/i}))
          .toHaveFocus()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`toggles closed when the trigger is clicked while open — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /calendar/i})
        await trigger.click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await trigger.click()
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => composite("defaultOpen"),
    simple: () => simple("defaultOpen"),
    testCase: (component) => {
      test(`defaultOpen renders the calendar initially open — ${component.name}`, async () => {
        await render(component)
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(`defaultOpen [open]="false"`),
    simple: () => simple(`defaultOpen [open]="false"`),
    testCase: (component) => {
      test(`controlled open false wins over defaultOpen — ${component.name}`, async () => {
        await render(component)
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
]

describe("DatePicker - Open/Close", () => {
  runTests(tests)
})
