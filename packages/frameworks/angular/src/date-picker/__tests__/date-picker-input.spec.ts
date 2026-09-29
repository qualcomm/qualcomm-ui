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

interface DatePickerLocaleDetails {
  locale: string
  timeZone: string
}

let formatSpy:
  | ((date: DateValue, details: DatePickerLocaleDetails) => string)
  | undefined
let parseSpy:
  | ((value: string, details: DatePickerLocaleDetails) => DateValue | undefined)
  | undefined

function compositeTemplate(rootAttrs = "", groupAttrs = "") {
  return `
    <div q-date-picker-root ${rootAttrs}>
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group ${groupAttrs}></div>
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
    <q-date-picker label="Departure date" ${rootAttrs} />
  `
}

class TestHost {
  readonly valueChangedHandler = output<any>()
  readonly june10 = parseDate("2024-06-10")
  readonly june15 = parseDate("2024-06-15")
  readonly june20 = parseDate("2024-06-20")
  readonly seededValue: (DateValue | null)[] = [parseDate("2024-06-15")]

  readonly format = (date: DateValue, details: DatePickerLocaleDetails) =>
    formatSpy!(date, details)

  readonly parse = (value: string, details: DatePickerLocaleDetails) =>
    parseSpy!(value, details)
}

function composite(rootAttrs?: string, groupAttrs?: string) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: compositeTemplate(rootAttrs, groupAttrs),
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

const watchValue = `(valueChanged)="valueChangedHandler.emit($event)"`

const seededAttrs = `[defaultValue]="seededValue"`
const boundedAttrs = `[max]="june20" [min]="june10"`
const roundTripAttrs = `
  [defaultValue]="seededValue"
  [format]="format"
  [parse]="parse"
  locale="en-GB"
  timeZone="Europe/Paris"
`

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(watchValue),
    simple: () => simple(watchValue),
    testCase: (component) => {
      test(`typing a valid date and pressing Enter commits it — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        const input = page.getByRole("textbox")
        await input.fill("06/20/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("06/20/2024")
        await expect
          .poll(() => valueChanged)
          .toHaveBeenCalledWith(
            expect.objectContaining({valueAsString: ["06/20/2024"]}),
          )
      })
    },
  },
  {
    composite: () => composite(`${seededAttrs} ${watchValue}`),
    simple: () => simple(`${seededAttrs} ${watchValue}`),
    testCase: (component) => {
      test(`an invalid date restores the last committed value — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        const input = page.getByRole("textbox")
        await input.fill("13/45/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("06/15/2024")
        expect(valueChanged).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => composite(roundTripAttrs),
    simple: () => simple(roundTripAttrs),
    testCase: (component) => {
      test(`custom parse and format functions drive the input round trip — ${component.name}`, async () => {
        formatSpy = vi.fn((date: DateValue) =>
          date.toString().replaceAll("-", "/"),
        )
        parseSpy = vi.fn((value: string) =>
          value === "2024/06/20" ? parseDate("2024-06-20") : undefined,
        )
        await render(component)

        const input = page.getByRole("textbox")
        await expect.element(input).toHaveValue("2024/06/15")

        await input.fill("2024/06/20")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("2024/06/20")
        expect(parseSpy).toHaveBeenCalledWith("2024/06/20", {
          locale: "en-GB",
          timeZone: "Europe/Paris",
        })
        expect(formatSpy).toHaveBeenCalledWith(
          expect.objectContaining({day: 20, month: 6, year: 2024}),
          {locale: "en-GB", timeZone: "Europe/Paris"},
        )
      })
    },
  },
  {
    composite: () => composite(roundTripAttrs),
    simple: () => simple(roundTripAttrs),
    testCase: (component) => {
      test(`pressing Enter after filling the input invokes parse exactly once — ${component.name}`, async () => {
        formatSpy = vi.fn((date: DateValue) =>
          date.toString().replaceAll("-", "/"),
        )
        const parse = vi.fn((value: string) =>
          value === "2024/06/20" ? parseDate("2024-06-20") : undefined,
        )
        parseSpy = parse
        await render(component)

        const input = page.getByRole("textbox")
        await input.fill("2024/06/20")
        parse.mockClear()

        await userEvent.keyboard("{Enter}")

        expect(parse).toHaveBeenCalledOnce()
      })
    },
  },
  {
    composite: () => composite(`${seededAttrs} ${watchValue}`),
    simple: () => simple(`${seededAttrs} ${watchValue}`),
    testCase: (component) => {
      test(`clearing the input clears the committed value — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        const input = page.getByRole("textbox")
        await expect.element(input).toHaveValue("06/15/2024")

        await input.fill("")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("")
        await expect
          .poll(() => valueChanged)
          .toHaveBeenCalledWith(
            expect.objectContaining({value: [], valueAsString: []}),
          )
      })
    },
  },
  {
    composite: () => composite(boundedAttrs),
    simple: () => simple(boundedAttrs),
    testCase: (component) => {
      test(`constrains an above-max date to the max on blur — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("textbox")
        await input.fill("06/25/2024")
        await userEvent.keyboard("{Tab}")

        await expect.element(input).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => composite(boundedAttrs),
    simple: () => simple(boundedAttrs),
    testCase: (component) => {
      test(`constrains a below-min date to the min on blur — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("textbox")
        await input.fill("06/05/2024")
        await userEvent.keyboard("{Tab}")

        await expect.element(input).toHaveValue("06/10/2024")
      })
    },
  },
  {
    composite: () => composite(boundedAttrs, `[fixOnBlur]="false"`),
    simple: () => simple(`${boundedAttrs} [fixOnBlur]="false"`),
    testCase: (component) => {
      test(`fixOnBlur false leaves an out-of-range entry untouched on blur — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("textbox")
        await input.fill("06/25/2024")
        await userEvent.keyboard("{Tab}")

        await expect.element(input).toHaveValue("06/25/2024")
      })
    },
  },
]

describe("DatePicker - Input", () => {
  runTests(tests)
})
