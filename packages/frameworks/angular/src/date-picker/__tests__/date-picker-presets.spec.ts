import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {
  type DatePickerPreset,
  DatePickerModule,
  parseDate,
} from "@qualcomm-ui/angular/date-picker"

const seeded = parseDate("2024-06-15")

const presets: DatePickerPreset[] = [
  {label: "Next 7 days", value: "next7Days"},
  {label: "This month", value: "thisMonth"},
  {
    label: "Fixed span",
    value: [parseDate("2024-07-01"), parseDate("2024-07-10")],
  },
]

function compositeTemplate(rootAttrs = "") {
  return `
    <div
      q-date-picker-root
      selectionMode="range"
      [closeOnSelect]="false"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    >
      <div q-date-picker-control>
        <div label="Trip" q-date-picker-input-group></div>
      </div>
      <ng-template qPortal>
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            <div q-date-picker-view view="day">
              <div q-date-picker-view-control>
                <button q-date-picker-view-trigger view="month">
                  <q-date-picker-month-text />
                </button>
                <button q-date-picker-prev-trigger></button>
                <button q-date-picker-next-trigger></button>
                <button q-date-picker-presets-trigger></button>
              </div>
              <table q-date-picker-table>
                <thead q-date-picker-day-grid-header></thead>
                <tbody q-date-picker-day-grid></tbody>
              </table>
            </div>
            <div q-date-picker-presets>
              @for (preset of presets; track $index) {
                <button q-date-picker-preset-trigger [value]="preset.value">
                  {{ preset.label }}
                </button>
              }
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `
}

function simpleTemplate(rootAttrs = `[presets]="presets"`) {
  return `
    <q-date-picker
      label="Trip"
      selectionMode="range"
      [closeOnSelect]="false"
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
    protected readonly presets = presets
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
    protected readonly presets = presets
    protected readonly seeded = seeded
  }
  return SimpleComponent
}

const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()
const presetsTrigger = () => page.getByRole("button", {name: /show presets/i})
const calendarTrigger = () => page.getByRole("button", {name: /show calendar/i})
const startInput = () => page.getByRole("textbox", {name: /start date/i})
const endInput = () => page.getByRole("textbox", {name: /end date/i})

describe("DatePicker - Presets", () => {
  test("the presets trigger reveals the preset list and flips its own label", async () => {
    await render(simple())
    await openCalendar()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()

    await presetsTrigger().click()

    await expect.element(page.getByText("Next 7 days")).toBeVisible()
    await expect.element(calendarTrigger()).toBeVisible()

    await calendarTrigger().click()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
    await expect.element(presetsTrigger()).toBeVisible()
  })

  test("no presets trigger is rendered when no presets are given", async () => {
    await render(simple(""))
    await openCalendar()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect.element(presetsTrigger()).not.toBeInTheDocument()
  })

  test("a named preset commits a complete range and closes the panel", async () => {
    const valueChanged = vi.fn()
    await render(
      simple(`[presets]="presets" (valueChanged)="valueChangedHandler.emit()"`),
      {
        on: {
          valueChangedHandler: () => {
            valueChanged()
          },
        },
      },
    )
    await openCalendar()

    await presetsTrigger().click()
    await page.getByText("Next 7 days").click()

    await expect.element(startInput()).not.toHaveValue("")
    await expect.element(endInput()).not.toHaveValue("")
    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
    expect(valueChanged).toHaveBeenCalled()
  })

  test("a preset given as explicit dates commits exactly those dates", async () => {
    await render(simple())
    await openCalendar()

    await presetsTrigger().click()
    await page.getByText("Fixed span").click()

    await expect.element(startInput()).toHaveValue("07/01/2024")
    await expect.element(endInput()).toHaveValue("07/10/2024")
  })

  test("choosing a preset moves the calendar onto the preset's range", async () => {
    await render(simple())
    await openCalendar()

    await presetsTrigger().click()
    await page.getByText("Fixed span").click()

    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .toHaveTextContent("July")
  })

  test("the paging and view triggers are inert while the preset panel is open", async () => {
    await render(composite())
    await openCalendar()

    await presetsTrigger().click()

    await expect
      .element(page.getByRole("button", {name: /switch to next month/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to previous month/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .toBeDisabled()
  })

  test("reopening the calendar starts with the preset panel closed", async () => {
    await render(simple())
    await openCalendar()
    await presetsTrigger().click()
    await expect.element(page.getByText("Next 7 days")).toBeVisible()

    await page.getByRole("button", {name: /close calendar/i}).click()
    await openCalendar()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
  })

  test("a preset trigger describes the range it will apply", async () => {
    await render(simple())
    await openCalendar()
    await presetsTrigger().click()

    await expect
      .element(page.getByText("Fixed span"))
      .toHaveAttribute(
        "aria-label",
        "select Monday, July 1, 2024 to Wednesday, July 10, 2024",
      )
  })

  test("the preset label follows the picker's locale and time zone", async () => {
    await render(simple(`locale="de-DE" [presets]="presets"`))
    await openCalendar()
    await presetsTrigger().click()

    await expect
      .element(page.getByText("Fixed span"))
      .toHaveAttribute(
        "aria-label",
        "select Montag, 1. Juli 2024 to Mittwoch, 10. Juli 2024",
      )
  })

  test("a readOnly picker will not open the preset panel", async () => {
    await render(simple(`readOnly variant="inline" [presets]="presets"`))

    await presetsTrigger().click()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
  })
})
