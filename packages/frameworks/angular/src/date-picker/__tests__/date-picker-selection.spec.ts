import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {
  DatePickerModule,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/angular/date-picker"

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
    readonly seeded: DateValue = seeded
  }
  return CompositeComponent
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {
    readonly seeded: DateValue = seeded
  }
  return SimpleComponent
}

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`selecting a day with the pointer commits it and closes — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Space selects the focused day the calendar opened on — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{ }")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/15/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Enter selects the focused day the calendar opened on — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/15/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`arrow keys move day focus before committing — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{ArrowRight}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/16/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`ArrowDown moves focus forward one week — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{ArrowDown}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/22/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Home jumps to the first day of the month — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{Home}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/01/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`End jumps to the last day of the month — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{End}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/30/2024")
      })
    },
  },
]

describe("DatePicker - Selection", () => {
  runTests(tests)
})
