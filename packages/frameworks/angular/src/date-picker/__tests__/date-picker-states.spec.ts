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

class TestHost {
  readonly valueChangedHandler = output<any>()
  readonly seeded = parseDate("2024-06-15")
  readonly seededValue: (DateValue | null)[] = [parseDate("2024-06-15")]
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent extends TestHost {}
  return CompositeComponent
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent extends TestHost {}
  return SimpleComponent
}

const tests: MultiComponentTest[] = [
  {
    composite: () => composite("disabled"),
    simple: () => simple("disabled"),
    testCase: (component) => {
      test(`disabled prevents opening the calendar — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("button", {name: /open calendar/i}))
          .toBeDisabled()
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => composite(`[defaultValue]="seededValue" readOnly`),
    simple: () => simple(`[defaultValue]="seededValue" readOnly`),
    testCase: (component) => {
      test(`readOnly leaves the trigger enabled but does not open the popover — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /open calendar/i})
        await expect.element(trigger).not.toBeDisabled()

        await trigger.click()
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
]

describe("DatePicker - States", () => {
  runTests(tests)

  test("readOnly inline calendar stays navigable but ignores selection", async () => {
    const valueChanged = vi.fn()
    await render(
      simple(
        `readOnly variant="inline" (valueChanged)="valueChangedHandler.emit($event)"`,
      ),
      {on: {valueChangedHandler: (event: unknown) => valueChanged(event)}},
    )

    await page.getByRole("gridcell", {name: /June 15, 2024/}).click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByLabelText(/June 16, 2024/)).toHaveFocus()

    await userEvent.keyboard("{Enter}")
    expect(valueChanged).not.toHaveBeenCalled()
  })
})
