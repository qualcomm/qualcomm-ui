import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {
  DatePickerModule,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/angular/date-picker"

import {type MultiComponentTest, runTests} from "~test-utils"

function simpleTemplate(rootAttrs = "") {
  return `
    <q-date-picker
      label="Dates"
      selectionMode="multiple"
      [defaultFocusedValue]="seeded"
      ${rootAttrs}
    />
  `
}

function simple(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: simpleTemplate(rootAttrs),
  })
  class SimpleComponent {
    readonly valueChangedHandler = output<any>()
    readonly seeded = parseDate("2024-06-15")
    readonly twoDates: (DateValue | null)[] = [
      parseDate("2024-06-10"),
      parseDate("2024-06-20"),
    ]
    readonly threeDates: (DateValue | null)[] = [
      parseDate("2024-06-10"),
      parseDate("2024-06-20"),
      parseDate("2024-06-25"),
    ]
  }
  return SimpleComponent
}

// the field is the calendar trigger, so the label names it
function getField() {
  return page.getByRole("combobox", {name: "Dates"})
}

const watchValue = `(valueChanged)="valueChangedHandler.emit($event)"`

const twoDatesAttrs = `[defaultValue]="twoDates"`

const tests: MultiComponentTest[] = [
  {
    simple: () => simple(),
    testCase: (component) => {
      test(`shows the placeholder when nothing is selected — ${component.name}`, async () => {
        await render(component)
        await expect.element(page.getByText("Select dates")).toBeVisible()
      })
    },
  },
  {
    simple: () => simple(twoDatesAttrs),
    testCase: (component) => {
      test(`renders one dismissible tag per selected date — ${component.name}`, async () => {
        await render(component)
        await expect.element(page.getByText("06/10/2024")).toBeVisible()
        await expect.element(page.getByText("06/20/2024")).toBeVisible()
      })
    },
  },
  {
    simple: () => simple(twoDatesAttrs),
    testCase: (component) => {
      test(`dismissing a tag removes that date — ${component.name}`, async () => {
        await render(component)

        await page.getByRole("button", {name: /Remove 06\/10\/2024/i}).click()

        await expect
          .element(page.getByText("06/10/2024"))
          .not.toBeInTheDocument()
        await expect.element(page.getByText("06/20/2024")).toBeVisible()
      })
    },
  },
  {
    simple: () => simple(`${twoDatesAttrs} maxSelectedDates="2"`),
    testCase: (component) => {
      test(`disables only unselected days once maxSelectedDates is reached — ${component.name}`, async () => {
        await render(component)
        await getField().click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await expect
          .element(page.getByRole("gridcell", {name: /June 25, 2024/}))
          .toHaveAttribute("aria-disabled", "true")

        await expect
          .element(page.getByRole("gridcell", {name: /June 10, 2024/}))
          .toHaveAttribute("aria-disabled", "false")
      })
    },
  },
]

describe("DatePicker - Multiple", () => {
  runTests(tests)

  test("clicking a selected day removes it from the selection", async () => {
    await render(simple(twoDatesAttrs))
    await getField().click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(page.getByText("06/10/2024")).not.toBeInTheDocument()
    await expect.element(page.getByText("06/20/2024")).toBeVisible()
  })

  test("Enter toggles the focused day without closing the calendar", async () => {
    await render(simple())
    await getField().click()

    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("06/15/2024")).toBeVisible()

    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("06/15/2024")).not.toBeInTheDocument()
    await expect.element(page.getByRole("grid")).toBeVisible()
  })

  test("selections are kept in chronological order regardless of pick order", async () => {
    const valueChanged = vi.fn()
    await render(simple(watchValue), {
      on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
    })
    await getField().click()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect
      .poll(() => valueChanged)
      .toHaveBeenLastCalledWith(
        expect.objectContaining({
          valueAsString: ["06/10/2024", "06/20/2024"],
        }),
      )
  })

  test("maxSelectedDates rejects a further selection", async () => {
    const valueChanged = vi.fn()
    await render(
      simple(`${twoDatesAttrs} maxSelectedDates="2" ${watchValue}`),
      {
        on: {valueChangedHandler: (event: unknown) => valueChanged(event)},
      },
    )
    await getField().click()
    await expect.element(page.getByRole("grid")).toBeVisible()

    /**
     * Playwright refuses to click an `aria-disabled` element, so drive the
     * component's own selectable guard with a native click.
     */
    const cell = page.getByLabelText(/June 25, 2024/).element() as HTMLElement
    cell.click()

    expect(valueChanged).not.toHaveBeenCalled()
    await expect.element(page.getByText("06/25/2024")).not.toBeInTheDocument()
  })

  test("a date freed up by deselection can be re-spent under maxSelectedDates", async () => {
    await render(simple(`${twoDatesAttrs} maxSelectedDates="2"`))
    await getField().click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 25, 2024/}).click()

    await expect.element(page.getByText("06/20/2024")).toBeVisible()
    await expect.element(page.getByText("06/25/2024")).toBeVisible()
    await expect.element(page.getByText("06/10/2024")).not.toBeInTheDocument()
  })

  test("the multiple field has no text input, so the label names the field", async () => {
    await render(simple())

    await expect.element(getField()).toBeVisible()
    await expect.element(page.getByRole("textbox")).not.toBeInTheDocument()
  })

  test("a disabled picker renders its tags as disabled", async () => {
    await render(simple(`disabled [defaultValue]="twoDates"`))

    await expect
      .element(page.getByRole("button", {name: /Remove 06\/10\/2024/i}))
      .toBeDisabled()
  })

  test("the inline headline collapses more than two dates into a summary", async () => {
    await render(simple(`variant="inline" [defaultValue]="threeDates"`))

    await expect.element(page.getByText("Jun 10, 2024 +2 more")).toBeVisible()
  })

  test("the inline headline lists two dates in full", async () => {
    await render(simple(`variant="inline" ${twoDatesAttrs}`))

    await expect
      .element(page.getByText("Jun 10, 2024, Jun 20, 2024"))
      .toBeVisible()
  })

  describe("the field acts as the calendar trigger", () => {
    test("clicking the field toggles the calendar", async () => {
      await render(simple())

      await getField().click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await getField().click()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("clicking the placeholder opens the calendar", async () => {
      await render(simple())

      await page.getByText("Select dates").click()

      await expect.element(page.getByRole("grid")).toBeVisible()
    })

    test("clicking a tag does not open the calendar", async () => {
      await render(simple(twoDatesAttrs))

      await page.getByText("06/10/2024").click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("dismissing a tag does not open the calendar", async () => {
      await render(simple(twoDatesAttrs))

      await page.getByRole("button", {name: /Remove 06\/10\/2024/i}).click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("clearing the value does not open the calendar", async () => {
      await render(simple(twoDatesAttrs))

      await page.getByRole("button", {name: /clear/i}).click()

      await expect.element(page.getByText("Select dates")).toBeVisible()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test.for(["{Enter}", " "])("%s opens the calendar", async (key) => {
      await render(simple())

      // open then close leaves the field focused and closed
      await getField().click()
      await getField().click()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      await expect.element(getField()).toHaveFocus()

      await userEvent.keyboard(key)
      await expect.element(page.getByRole("grid")).toBeVisible()
    })

    test("ArrowDown opens the calendar", async () => {
      await render(simple())

      await getField().click()
      await getField().click()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()

      await userEvent.keyboard("{ArrowDown}")
      await expect.element(page.getByRole("grid")).toBeVisible()
    })

    test("escape closes the calendar and restores focus to the field", async () => {
      await render(simple())

      await getField().click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await userEvent.keyboard("{Escape}")

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      await expect.element(getField()).toHaveFocus()
    })

    test("a disabled field does not open the calendar", async () => {
      await render(simple("disabled"))

      await expect.element(getField()).toHaveAttribute("aria-disabled", "true")

      const field = getField().element() as HTMLElement
      field.click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("a readonly field does not open the calendar", async () => {
      await render(simple("readOnly"))

      await expect.element(getField()).toHaveAttribute("aria-readonly", "true")

      await getField().click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("switching selectionMode at runtime hands the trigger over cleanly", async () => {
      @Component({
        imports: [DatePickerModule],
        template: `
          <q-date-picker
            label="Dates"
            [defaultFocusedValue]="seeded"
            [selectionMode]="mode"
          />
          <button type="button" (click)="swap()">Swap mode</button>
        `,
      })
      class ModeSwitcherComponent {
        readonly seeded = parseDate("2024-06-15")
        mode: "multiple" | "single" = "multiple"

        swap() {
          this.mode = this.mode === "multiple" ? "single" : "multiple"
        }
      }

      await render(ModeSwitcherComponent)
      await expect.element(getField()).toBeVisible()

      await page.getByRole("button", {name: "Swap mode"}).click()

      const trigger = page.getByRole("button", {
        name: /(?:choose|change) date/i,
      })
      await expect.element(trigger).toBeVisible()
      await trigger.click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await userEvent.keyboard("{Escape}")
      await expect.element(trigger).toHaveFocus()

      await page.getByRole("button", {name: "Swap mode"}).click()

      await expect.element(getField()).toBeVisible()
      await getField().click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await userEvent.keyboard("{Escape}")
      await expect.element(getField()).toHaveFocus()
    })

    test("switching to range restores the group role on the field", async () => {
      @Component({
        imports: [DatePickerModule],
        template: `
          <q-date-picker
            label="Dates"
            [defaultFocusedValue]="seeded"
            [selectionMode]="mode"
          />
          <button type="button" (click)="swap()">Swap mode</button>
        `,
      })
      class RangeSwitcherComponent {
        readonly seeded = parseDate("2024-06-15")
        mode: "multiple" | "range" = "multiple"

        swap() {
          this.mode = this.mode === "multiple" ? "range" : "multiple"
        }
      }

      await render(RangeSwitcherComponent)
      await expect.element(getField()).toBeVisible()

      await page.getByRole("button", {name: "Swap mode"}).click()

      // dir and role both change source with the mode, so a second binding
      // system on this element used to blank them out here
      const group = page.getByRole("group", {name: "Dates"})
      await expect.element(group).toBeVisible()
      await expect.element(group).toHaveAttribute("dir", "ltr")

      await page.getByRole("button", {name: "Swap mode"}).click()

      await expect.element(getField()).toBeVisible()
      await expect.element(getField()).toHaveAttribute("dir", "ltr")
    })

    test("clicking the label focuses the field", async () => {
      await render(simple())

      await page.getByText("Dates", {exact: true}).click()

      await expect.element(getField()).toHaveFocus()
    })

    test("the calendar icon is not a separate tab stop", async () => {
      await render(simple())

      await expect
        .element(page.getByRole("button", {name: /(?:choose|change) date/i}))
        .not.toBeInTheDocument()
    })
  })
})
