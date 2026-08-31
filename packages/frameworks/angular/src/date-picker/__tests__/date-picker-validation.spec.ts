import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

const hint = "Arrival must be after this date"
const errorText = "Pick a date in the future"

function compositeTemplate(rootAttrs: string) {
  return `
    <div q-date-picker-root ${rootAttrs}>
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group></div>
      </div>
      <div q-date-picker-hint>${hint}</div>
      <div q-date-picker-error-text>${errorText}</div>
      <ng-template qPortal>
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            <div q-date-picker-view view="day">
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

function simpleTemplate(rootAttrs: string) {
  return `
    <q-date-picker
      errorText="${errorText}"
      hint="${hint}"
      label="Departure date"
      ${rootAttrs}
    />
  `
}

function invalidMultipleTemplate() {
  return `
    <q-date-picker
      errorText="${errorText}"
      invalid
      label="Dates"
      selectionMode="multiple"
    />
  `
}

function composite(rootAttrs = "") {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs),
  })
  class CompositeComponent {}
  return CompositeComponent
}

function simple(rootAttrs = "") {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {}
  return SimpleComponent
}

const input = () => page.getByRole("textbox")

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`a valid picker shows the hint and hides the error text — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(hint)).toBeVisible()
        await expect.element(page.getByText(errorText)).not.toBeVisible()
        await expect
          .element(input())
          .not.toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite: () => composite("invalid"),
    simple: () => simple("invalid"),
    testCase: (component) => {
      test(`an invalid picker swaps the hint for the error text — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(errorText)).toBeVisible()
        await expect.element(page.getByText(hint)).not.toBeVisible()
      })
    },
  },
  {
    composite: () => composite("invalid"),
    simple: () => simple("invalid"),
    testCase: (component) => {
      test(`an invalid picker marks the input and points it at the error text — ${component.name}`, async () => {
        await render(component)

        await expect.element(input()).toHaveAttribute("aria-invalid", "true")

        const describedBy = input().element().getAttribute("aria-describedby")
        const errorId = page.getByText(errorText).element().id
        expect(describedBy?.split(" ")).toContain(errorId)
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the hint is associated with the input — ${component.name}`, async () => {
        await render(component)

        const describedBy = input().element().getAttribute("aria-describedby")
        const hintId = page.getByText(hint).element().id
        expect(describedBy?.split(" ")).toContain(hintId)
      })
    },
  },
  {
    composite: () => composite("invalid"),
    simple: () => simple("invalid"),
    testCase: (component) => {
      test(`the error indicator only appears while invalid — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByLabelText("Error")).toBeVisible()
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the error indicator is absent while valid — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByLabelText("Error")).not.toBeVisible()
      })
    },
  },
]

@Component({
  imports: [DatePickerModule],
  template: `
    <q-date-picker label="Departure date" />
  `,
})
class LabelledComponent {}

@Component({
  imports: [DatePickerModule],
  template: `
    <q-date-picker label="Trip" selectionMode="range" />
  `,
})
class RangeComponent {}

@Component({
  imports: [DatePickerModule],
  template: `
    <q-date-picker invalid label="Trip" selectionMode="range" />
  `,
})
class InvalidRangeComponent {}

@Component({
  imports: [DatePickerModule],
  template: invalidMultipleTemplate(),
})
class InvalidMultipleComponent {}

describe("DatePicker - Validation", () => {
  runTests(tests)

  test("the label is wired to the single input", async () => {
    await render(LabelledComponent)

    await expect
      .element(page.getByLabelText("Departure date"))
      .toHaveAttribute("data-date-picker-part", "input")
  })

  test("a range picker groups its two inputs under the shared label", async () => {
    await render(RangeComponent)

    const group = page.getByRole("group", {name: "Trip"})
    await expect.element(group).toBeVisible()
    expect(group.element().querySelectorAll("input")).toHaveLength(2)
  })

  test("an invalid range picker marks both of its inputs", async () => {
    await render(InvalidRangeComponent)

    await expect
      .element(page.getByRole("textbox", {name: /start date/i}))
      .toHaveAttribute("aria-invalid", "true")
    await expect
      .element(page.getByRole("textbox", {name: /end date/i}))
      .toHaveAttribute("aria-invalid", "true")
  })

  test("multiple mode carries the invalid state on the field, since it has no input to mark", async () => {
    await render(InvalidMultipleComponent)

    const field = page.getByRole("combobox", {name: "Dates"})
    await expect.element(field).toHaveAttribute("aria-invalid", "true")

    const describedBy = field.element().getAttribute("aria-describedby")
    const errorId = page.getByText(errorText).element().id
    expect(describedBy?.split(" ")).toContain(errorId)
  })
})
