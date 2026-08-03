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
    <div
      q-date-picker-root
      selectionMode="range"
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
      label="Trip"
      selectionMode="range"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    />
  `
}

class TestHost {
  readonly valueChangedHandler = output<any>()
  readonly seeded = parseDate("2024-06-15")
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

const startInput = () => page.getByRole("textbox", {name: /start date/i})
const endInput = () => page.getByRole("textbox", {name: /end date/i})

/**
 * Cell state (`data-*`) and focus live on the trigger inside the `gridcell`,
 * not on the cell itself.
 */
const dayTrigger = (day: string) => page.getByLabelText(day)

const watchValue = `(valueChanged)="valueChangedHandler.emit($event)"`

const fullRangeAttrs = `[defaultValue]="fullRange"`

const tests: MultiComponentTest[] = [
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`the range start keeps the calendar open and the end closes it — ${component.name}`, async () => {
        await render(component)
        await page.getByRole("button", {name: /open calendar/i}).click()

        await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

        await expect.element(page.getByRole("grid")).toBeVisible()
        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("")

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`typing the end date first leaves the start slot empty, then accepts a start date — ${component.name}`, async () => {
        await render(component)

        await endInput().fill("06/20/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("")
        await expect.element(endInput()).toHaveValue("06/20/2024")

        await startInput().fill("06/10/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`normalizes a reversed range entered via input — ${component.name}`, async () => {
        await render(component)

        await startInput().fill("06/20/2024")
        await userEvent.keyboard("{Enter}")
        await endInput().fill("06/10/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => composite(`${fullRangeAttrs} ${watchValue}`),
    simple: () => simple(`${fullRangeAttrs} ${watchValue}`),
    testCase: (component) => {
      test(`clearing only the start input leaves the end date intact — ${component.name}`, async () => {
        const valueChanged = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
        })

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")

        await startInput().fill("")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("")
        await expect.element(endInput()).toHaveValue("06/20/2024")
        await expect
          .poll(() => valueChanged)
          .toHaveBeenCalledWith(
            expect.objectContaining({valueAsString: ["", "06/20/2024"]}),
          )
      })
    },
  },
  {
    composite: () => composite(fullRangeAttrs),
    simple: () => simple(fullRangeAttrs),
    testCase: (component) => {
      test(`reverts an unparsable start date when tabbing to the end input, leaving the end intact — ${component.name}`, async () => {
        await render(component)

        await startInput().fill("64564")
        await userEvent.keyboard("{Tab}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => composite(),
    simple: () => simple(),
    testCase: (component) => {
      test(`reverts trailing garbage typed into the start input after it committed — ${component.name}`, async () => {
        await render(component)

        await startInput().fill("06/10/2024")
        await userEvent.keyboard("{Enter}")
        await expect.element(startInput()).toHaveValue("06/10/2024")

        await userEvent.keyboard("99")
        await userEvent.keyboard("{Tab}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
      })
    },
  },
]

describe("DatePicker - Range", () => {
  runTests(tests)

  test("previews the range band while hovering after picking a start date", async () => {
    await render(simple())
    await page.getByRole("button", {name: /open calendar/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await dayTrigger("June 20, 2024").hover()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 10, 2024"))
      .toHaveAttribute("data-hover-range-start")
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-in-hover-range")
    await expect
      .element(dayTrigger("June 20, 2024"))
      .toHaveAttribute("data-hover-range-end")

    await expect
      .element(dayTrigger("June 25, 2024"))
      .not.toHaveAttribute("data-in-hover-range")
  })

  test("marks the committed range band once both endpoints are selected", async () => {
    await render(simple(`[closeOnSelect]="false"`))
    await page.getByRole("button", {name: /open calendar/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 10, 2024"))
      .toHaveAttribute("data-range-start")
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-in-range")
    await expect
      .element(dayTrigger("June 20, 2024"))
      .toHaveAttribute("data-range-end")

    await expect
      .element(dayTrigger("June 25, 2024"))
      .not.toHaveAttribute("data-in-range")
  })

  test("leaving the grid clears the previewed band", async () => {
    await render(simple())
    await page.getByRole("button", {name: /open calendar/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await dayTrigger("June 20, 2024").hover()
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-in-hover-range")

    await page.getByRole("button", {name: /switch to next month/i}).hover()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 15, 2024"))
      .not.toHaveAttribute("data-in-hover-range")
  })

  test("keyboard navigation previews the band the same way hovering does", async () => {
    await render(simple())
    await page.getByRole("button", {name: /open calendar/i}).click()

    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowRight}{ArrowRight}")

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 17, 2024"))
      .toHaveAttribute("data-in-hover-range")
    await expect
      .element(dayTrigger("June 18, 2024"))
      .toHaveAttribute("data-hover-range-end")
  })

  test("a third click starts a new range from the clicked day", async () => {
    await render(simple(`[closeOnSelect]="false"`))
    await page.getByRole("button", {name: /open calendar/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")

    await page.getByRole("gridcell", {name: /June 25, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/25/2024")
    await expect.element(endInput()).toHaveValue("")
  })

  test("a range half-entered by typing resumes at the end slot in the calendar", async () => {
    await render(simple())

    await startInput().fill("06/10/2024")
    await userEvent.keyboard("{Enter}")

    await page.getByRole("button", {name: /open calendar/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("a range left with only an end date resumes at the start slot in the calendar", async () => {
    await render(simple(fullRangeAttrs))

    await startInput().fill("")
    await userEvent.keyboard("{Enter}")
    await expect.element(startInput()).toHaveValue("")

    await page.getByRole("button", {name: /open calendar/i}).click()
    await page.getByRole("gridcell", {name: /June 5, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/05/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("the second calendar pick completes the range regardless of click order", async () => {
    await render(simple())
    await page.getByRole("button", {name: /open calendar/i}).click()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("clearing only the end input leaves the start date intact", async () => {
    const valueChanged = vi.fn()
    await render(simple(`${fullRangeAttrs} ${watchValue}`), {
      on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
    })

    await endInput().fill("")
    await userEvent.keyboard("{Enter}")

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("")
    await expect
      .poll(() => valueChanged)
      .toHaveBeenCalledWith(
        expect.objectContaining({valueAsString: ["06/10/2024"]}),
      )
  })

  test("the range headline shows placeholders until both endpoints are set", async () => {
    await render(simple(`variant="inline"`))

    await expect.element(page.getByText("Start - End")).toBeVisible()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(page.getByText("Jun 10, 2024 - End")).toBeVisible()
  })

  test("the default separator sits between the range inputs", async () => {
    await render(simple())

    await expect
      .element(page.getByText("-", {exact: true}))
      .toHaveAttribute("data-date-picker-part", "range-separator")
  })

  test("separator overrides the character between the range inputs", async () => {
    await render(simple(`separator="to"`))

    await expect.element(page.getByText("to", {exact: true})).toBeVisible()
    await expect
      .element(page.getByText("-", {exact: true}))
      .not.toBeInTheDocument()
  })
})
