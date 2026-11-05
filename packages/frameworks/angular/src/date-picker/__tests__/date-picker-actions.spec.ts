import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"
import type {DatePickerValueChangeDetails} from "@qualcomm-ui/core/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const seeded = parseDate("2024-06-15")
const prior = [parseDate("2024-06-10")]

function compositeTemplate(rootAttrs = "") {
  return `
    <div
      q-date-picker-root
      [closeOnSelect]="false"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    >
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
            <div q-date-picker-actions>
              <button q-date-picker-cancel-trigger></button>
              <button q-date-picker-ok-trigger></button>
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
      [closeOnSelect]="false"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    />
  `
}

function closeOnSelectDefaultTemplate() {
  return `<q-date-picker label="Departure date" [defaultFocusedValue]="seeded" />`
}

function multipleSelectionTemplate() {
  return `
    <q-date-picker
      label="Dates"
      selectionMode="multiple"
      [defaultFocusedValue]="seeded"
    />
  `
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {
    readonly valueChangedHandler = output<DatePickerValueChangeDetails>()
    protected readonly prior = prior
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
    readonly valueChangedHandler = output<DatePickerValueChangeDetails>()
    protected readonly prior = prior
    protected readonly seeded = seeded
  }
  return SimpleComponent
}

function closeOnSelectDefault() {
  @Component({
    imports: [DatePickerModule],
    template: closeOnSelectDefaultTemplate(),
  })
  class DefaultComponent {
    protected readonly seeded = seeded
  }
  return DefaultComponent
}

function multipleSelection() {
  @Component({
    imports: [DatePickerModule],
    template: multipleSelectionTemplate(),
  })
  class MultipleComponent {
    protected readonly seeded = seeded
  }
  return MultipleComponent
}

const grid = () => page.getByRole("grid")
const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()
const okTrigger = () => page.getByRole("button", {name: "OK"})
const cancelTrigger = () => page.getByRole("button", {name: "Cancel"})

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`closeOnSelect=false keeps the calendar open after a selection — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

        await expect.element(grid()).toBeVisible()
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
      test(`OK closes the calendar and keeps the selection — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await okTrigger().click()

        await expect.element(grid()).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () =>
      composite(
        `[defaultValue]="prior" (valueChanged)="valueChangedHandler.emit($event)"`,
      ),
    simple: () =>
      simple(
        `[defaultValue]="prior" (valueChanged)="valueChangedHandler.emit($event)"`,
      ),
    testCase: (component) => {
      test(`Cancel discards the pending selection and restores the value the calendar opened with — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {
            valueChangedHandler: (details) => {
              valueChanged(details)
            },
          },
        })
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")

        await cancelTrigger().click()

        await expect.element(grid()).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/10/2024")
        await expect
          .poll(() => valueChanged)
          .toHaveBeenLastCalledWith(
            expect.objectContaining({valueAsString: ["06/10/2024"]}),
          )
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`Cancel with no prior value leaves the field empty — ${component.name}`, async () => {
        await render(component)
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await cancelTrigger().click()

        await expect.element(page.getByRole("textbox")).toHaveValue("")
      })
    },
  },
  {
    composite: () => composite(`[defaultValue]="prior"`),
    simple: () => simple(`[defaultValue]="prior"`),
    testCase: (component) => {
      test(`a reopened calendar takes a fresh snapshot, so Cancel restores the previously confirmed value — ${component.name}`, async () => {
        await render(component)

        await openCalendar()
        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await okTrigger().click()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")

        await openCalendar()
        await page.getByRole("gridcell", {name: /June 25, 2024/}).click()
        await cancelTrigger().click()

        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
]

describe("DatePicker - Actions", () => {
  runTests(tests)

  test("the actions footer is omitted while closeOnSelect is left at its default", async () => {
    await render(closeOnSelectDefault())
    await openCalendar()

    await expect.element(grid()).toBeVisible()
    await expect.element(okTrigger()).not.toBeInTheDocument()
    await expect.element(cancelTrigger()).not.toBeInTheDocument()
  })

  test("multiple mode renders the actions footer so the popover survives each toggle", async () => {
    await render(multipleSelection())
    // in multiple mode the field itself is the trigger
    await page.getByRole("combobox", {name: "Dates"}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(grid()).toBeVisible()
    await okTrigger().click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByText("06/10/2024")).toBeVisible()
    await expect.element(page.getByText("06/20/2024")).toBeVisible()
  })

  test("Escape behaves like Cancel, discarding the pending selection", async () => {
    await render(simple(`[defaultValue]="prior"`))
    await openCalendar()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await userEvent.keyboard("{Escape}")

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/10/2024")
  })
})
