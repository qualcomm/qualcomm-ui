import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const seeded = parseDate("2024-06-15")

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const dayView = `
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
`

function popover(content: string) {
  return `
    <ng-template qPortal>
      <div q-date-picker-positioner>
        <div q-date-picker-content>${content}</div>
      </div>
    </ng-template>
  `
}

function compositeTemplate(rootAttrs = "") {
  return `
    <div q-date-picker-root [defaultFocusedValue]="seeded" ${rootAttrs}>
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group></div>
      </div>
      ${popover(`
        ${dayView}
        <div q-date-picker-view view="month">
          <div q-date-picker-view-control>
            <button q-date-picker-prev-trigger></button>
            <button q-date-picker-next-trigger></button>
          </div>
          <table q-date-picker-table>
            <tbody q-date-picker-month-grid></tbody>
          </table>
        </div>
        <div q-date-picker-view view="year">
          <div q-date-picker-view-control>
            <button q-date-picker-prev-trigger></button>
            <button q-date-picker-next-trigger></button>
          </div>
          <table q-date-picker-table>
            <tbody q-date-picker-year-grid></tbody>
          </table>
        </div>
      `)}
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

function customTriggerTemplate() {
  return `
    <div
      q-date-picker-root
      [closeOnSelect]="false"
      [defaultFocusedValue]="seeded"
    >
      <ng-container *datePickerContext="let api">
        <div q-date-picker-control>
          <button q-button q-date-picker-trigger variant="outline">
            {{ api.valueAsString[0] ?? "Pick a date" }}
          </button>
        </div>
      </ng-container>
      ${popover(dayView)}
    </div>
  `
}

function contextValueTemplate() {
  return `
    <div q-date-picker-root [defaultFocusedValue]="seeded">
      <ng-container *datePickerContext="let api">
        <span>{{ api.valueAsString[0] ?? "nothing selected" }}</span>
      </ng-container>
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group></div>
      </div>
      ${popover(dayView)}
    </div>
  `
}

function triggerOnlyTemplate() {
  return `
    <div closeOnSelect q-date-picker-root [defaultFocusedValue]="seeded">
      <div q-date-picker-control>
        <button q-button q-date-picker-trigger variant="outline">
          Pick a date
        </button>
      </div>
      ${popover(dayView)}
    </div>
  `
}

function composite(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {
    readonly seeded = seeded
  }
  return CompositeComponent
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {
    readonly seeded = seeded
    readonly selected = [parseDate("2024-06-10")]
    readonly value = [seeded]
  }
  return SimpleComponent
}

@Component({
  imports: [DatePickerModule],
  template: `
    <q-date-picker selectionMode="multiple" [defaultValue]="selected" />
  `,
})
class MultipleNoLabelComponent {
  readonly selected = [parseDate("2024-06-10"), parseDate("2024-06-12")]
}

@Component({
  imports: [ButtonModule, DatePickerModule, PortalDirective],
  template: customTriggerTemplate(),
})
class CustomTriggerComponent {
  readonly seeded = seeded
}

@Component({
  imports: [ButtonModule, DatePickerModule, PortalDirective],
  styles: `
    :host {
      display: block;
      padding: 120px 0 0 200px;
    }
  `,
  template: customTriggerTemplate(),
})
class OffsetCustomTriggerComponent {
  readonly seeded = seeded
}

@Component({
  imports: [DatePickerModule, PortalDirective],
  template: contextValueTemplate(),
})
class ContextValueComponent {
  readonly seeded = seeded
}

@Component({
  imports: [ButtonModule, DatePickerModule, PortalDirective],
  template: triggerOnlyTemplate(),
})
class TriggerOnlyComponent {
  readonly seeded = seeded
}

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`trigger accessible name reflects the open state — ${component.name}`, async () => {
        await render(component)

        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()

        await expect
          .element(page.getByRole("button", {name: /close calendar/i}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the popup is a dialog announced by name, wrapping an application view — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {
          name: /(?:choose|change) date/i,
        })
        await expect.element(trigger).toHaveAttribute("aria-haspopup", "dialog")
        await trigger.click()

        const dialog = page.getByRole("dialog")
        await expect.element(dialog).toBeVisible()
        await expect.element(dialog).toHaveAccessibleName("calendar")
        await expect
          .element(dialog)
          .toHaveAttribute("aria-roledescription", "datepicker")

        await expect.element(page.getByRole("application")).toBeVisible()
      })
    },
  },
  {
    simple: () => simple(`variant="inline"`),
    testCase: (component) => {
      test(`the inline calendar is a group, not a dialog — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("grid")).toBeVisible()
        await expect.element(page.getByRole("dialog")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("group", {name: "calendar"}))
          .toBeVisible()
        await expect.element(page.getByRole("application")).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`weekday headers expose full day names to assistive technology — ${component.name}`, async () => {
        await render(component)

        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        const headers = page.getByRole("columnheader")
        expect(headers.elements()).toHaveLength(7)

        for (const [index, weekday] of weekdays.entries()) {
          await expect.element(headers.nth(index)).toHaveAccessibleName(weekday)
        }
      })
    },
  },
  {
    simple: () => simple(`variant="inline"`),
    testCase: (component) => {
      test(`inline variant renders an always-open calendar with no popover trigger — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("grid")).toBeVisible()
        await expect
          .element(page.getByRole("button", {name: /(?:choose|change) date/i}))
          .not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => CustomTriggerComponent,
    testCase: (component) => {
      test(`a custom Trigger renders custom content and opens the calendar — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("Pick a date")).toBeVisible()

        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(`minView="month"`),
    testCase: (component) => {
      test(`minView='month' opens directly at the month view — ${component.name}`, async () => {
        await render(component)
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()

        await expect
          .element(page.getByRole("grid"))
          .toHaveAttribute("aria-roledescription", "calendar year")
      })
    },
  },
]

describe("DatePicker - Parts", () => {
  runTests(tests)

  test("the trigger confirms the selected date in its accessible name", async () => {
    await render(simple(`[defaultValue]="selected"`))

    await expect
      .element(page.getByRole("button", {name: /(?:choose|change) date/i}))
      .toHaveAccessibleName("Change date, Monday, June 10, 2024")
  })

  test("the trigger names both ends of a committed range, and a half-open one", async () => {
    await render(simple(`selectionMode="range" [defaultValue]="selected"`))

    await expect
      .element(page.getByRole("button", {name: /(?:choose|change) date/i}))
      .toHaveAccessibleName("Change date range, from Monday, June 10, 2024")
  })

  test("the field-as-trigger counts selections in multiple mode", async () => {
    await render(MultipleNoLabelComponent)

    await expect
      .element(page.getByLabelText(/change dates/i))
      .toHaveAccessibleName("Change dates, 2 selected")
  })

  test("the calendar grid is named by the range it shows, at every view level", async () => {
    await render(simple(`variant="inline"`))

    const grid = () => page.getByRole("grid")
    await expect.element(grid()).toHaveAccessibleName("June 2024")

    await page.getByRole("button", {name: /switch to next month/i}).click()
    await expect.element(grid()).toHaveAccessibleName("July 2024")

    await page.getByRole("button", {name: /switch to month view/i}).click()
    await expect.element(grid()).toHaveAccessibleName("2024")

    await page.getByRole("button", {name: /return to calendar/i}).click()
    await page.getByRole("button", {name: /switch to year view/i}).click()
    await expect.element(grid()).toHaveAccessibleName("2020 - 2029")
  })

  test("a range picker's grid name does not repeat a single visible month", async () => {
    await render(simple(`selectionMode="range" variant="inline"`))

    await expect
      .element(page.getByRole("grid"))
      .toHaveAccessibleName("June 2024")
  })

  test("the inline headline captions the current selection", async () => {
    await render(simple(`variant="inline"`))

    await expect.element(page.getByText("Date", {exact: true})).toBeVisible()
    await expect.element(page.getByText("Select date")).toBeVisible()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByText("Thu, June 20, 2024")).toBeVisible()
  })

  test("a range picker's headline caption names the range", async () => {
    await render(simple(`selectionMode="range" variant="inline"`))

    await expect.element(page.getByText("Date range")).toBeVisible()
  })

  test("headline=false drops the headline from the inline calendar", async () => {
    await render(simple(`variant="inline" [headline]="false"`))

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect.element(page.getByText("Select date")).not.toBeInTheDocument()
  })

  test("the inline variant has no field, so there is no input or clear trigger", async () => {
    await render(simple(`variant="inline" [defaultValue]="value"`))

    await expect.element(page.getByRole("textbox")).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", {name: /clear selected dates/i}))
      .not.toBeInTheDocument()
  })

  test("the context directive updates once a selection commits", async () => {
    await render(ContextValueComponent)
    await expect.element(page.getByText("nothing selected")).toBeVisible()

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByText("06/20/2024")).toBeVisible()
    await expect
      .element(page.getByText("nothing selected"))
      .not.toBeInTheDocument()
  })

  test("a custom Trigger anchors the calendar to the control", async () => {
    await render(OffsetCustomTriggerComponent)

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await expect.element(page.getByRole("grid")).toBeVisible()

    const positioner = page
      .getByRole("grid")
      .element()
      .closest("[data-date-picker-part=positioner]") as HTMLElement
    const control = positioner.ownerDocument.querySelector(
      "[data-date-picker-part=control]",
    ) as HTMLElement

    await expect
      .poll(() => positioner.style.getPropertyValue("--x"))
      .not.toBe("")

    const controlRect = control.getBoundingClientRect()
    const positionerRect = positioner.getBoundingClientRect()

    expect(Math.abs(positionerRect.left - controlRect.left)).toBeLessThan(8)
    expect(positionerRect.top).toBeGreaterThan(controlRect.top)
  })

  test("a trigger-only picker returns focus to the trigger after a selection", async () => {
    await render(TriggerOnlyComponent)

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", {name: /(?:choose|change) date/i}))
      .toHaveFocus()
  })
})
