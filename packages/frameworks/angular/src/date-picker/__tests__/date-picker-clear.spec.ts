import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {afterEach, describe, expect, test, vi} from "vitest"
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
  readonly fullRange: (DateValue | null)[] = [
    parseDate("2024-06-10"),
    parseDate("2024-06-20"),
  ]
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

const clearTrigger = () =>
  page.getByRole("button", {name: /clear selected dates/i})

const watchValue = `(valueChanged)="valueChangedHandler.emit($event)"`

const seededAttrs = `[defaultValue]="seededValue"`
const rangeAttrs = `[defaultValue]="fullRange" selectionMode="range"`

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the clear trigger is hidden while nothing is selected — ${component.name}`, async () => {
        await render(component)
        await expect.element(clearTrigger()).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => composite(`${seededAttrs} ${watchValue}`),
    simple: () => simple(`${seededAttrs} ${watchValue}`),
    testCase: (component) => {
      test(`the clear trigger empties the field and reports the cleared value — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        await expect.element(clearTrigger()).toBeVisible()
        await clearTrigger().click()

        await expect.element(page.getByRole("textbox")).toHaveValue("")
        await expect
          .poll(() => valueChanged)
          .toHaveBeenCalledWith(
            expect.objectContaining({value: [], valueAsString: []}),
          )
        await expect.element(clearTrigger()).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => composite(seededAttrs),
    simple: () => simple(seededAttrs),
    testCase: (component) => {
      test(`clearing moves focus to the input — ${component.name}`, async () => {
        await render(component)

        await clearTrigger().click()

        await expect.element(page.getByRole("textbox")).toHaveFocus()
      })
    },
  },
  {
    composite: () => composite(`${seededAttrs} disabled ${watchValue}`),
    simple: () => simple(`${seededAttrs} disabled ${watchValue}`),
    testCase: (component) => {
      test(`the clear trigger is disabled alongside the picker — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        await expect.element(clearTrigger()).toBeDisabled()
        expect(valueChanged).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => composite(`${rangeAttrs} ${watchValue}`),
    simple: () => simple(`${rangeAttrs} ${watchValue}`),
    testCase: (component) => {
      test(`the clear trigger empties both ends of a range — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        await clearTrigger().click()

        await expect
          .element(page.getByRole("textbox", {name: /start date/i}))
          .toHaveValue("")
        await expect
          .element(page.getByRole("textbox", {name: /end date/i}))
          .toHaveValue("")
        await expect
          .poll(() => valueChanged)
          .toHaveBeenCalledWith(
            expect.objectContaining({value: [], valueAsString: []}),
          )
      })
    },
  },
]

describe("DatePicker - Clear", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  runTests(tests)

  test("a readOnly picker keeps the clear trigger inert", async () => {
    const valueChanged = vi.fn()
    await render(simple(`${seededAttrs} readOnly ${watchValue}`), {
      on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
    })

    await clearTrigger().click()

    await expect.element(page.getByRole("textbox")).toHaveValue("06/15/2024")
    expect(valueChanged).not.toHaveBeenCalled()
  })

  test("pressing Enter in a cleared input keeps it empty", async () => {
    await render(simple(seededAttrs))

    const input = page.getByRole("textbox")
    await input.fill("06/20/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(input).toHaveValue("06/20/2024")

    await clearTrigger().click()
    await expect.element(input).toHaveValue("")

    await userEvent.click(input.element())
    await userEvent.keyboard("{Enter}")

    await expect.element(input).toHaveValue("")
  })

  test("clearing while the calendar is open resets the focused day to today", async () => {
    vi.setSystemTime(new Date("2026-07-29T12:00:00Z"))
    await render(
      simple(`${seededAttrs} [closeOnSelect]="false" timeZone="UTC"`),
    )
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await expect.element(page.getByRole("grid")).toBeVisible()

    await clearTrigger().click()

    await expect.element(page.getByRole("textbox")).toHaveValue("")
    await expect
      .element(page.getByLabelText(/July 29, 2026/))
      .toHaveAttribute("data-today")
    await expect
      .element(page.getByLabelText(/July 29, 2026/))
      .toHaveAttribute("data-focus")
  })
})
