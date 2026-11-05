import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"

class TestHost {
  readonly seeded = parseDate("2024-06-15")
}

function host(template: string) {
  @Component({
    imports: [DatePickerModule],
    template,
  })
  class SlotHost extends TestHost {}
  return SlotHost
}

const field = (slot: string, attrs = "") => `
  <q-date-picker label="Departure" [defaultFocusedValue]="seeded" ${attrs}>
    ${slot}
  </q-date-picker>
`

const inline = (slot: string, attrs = "") => `
  <q-date-picker variant="inline" [defaultFocusedValue]="seeded" ${attrs}>
    ${slot}
  </q-date-picker>
`

const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()

describe("DatePicker - Slots", () => {
  test("a projected hint replaces the default", async () => {
    await render(host(field(`<div q-date-picker-hint>Projected hint</div>`)))

    await expect.element(page.getByText("Projected hint")).toBeVisible()
  })

  test("a projected hint wins over the hint input", async () => {
    await render(
      host(
        field(`<div q-date-picker-hint>Projected hint</div>`, `hint="Ignored"`),
      ),
    )

    await expect.element(page.getByText("Projected hint")).toBeVisible()
    await expect.element(page.getByText("Ignored")).not.toBeInTheDocument()
  })

  test("a projected error text replaces the default", async () => {
    await render(
      host(
        field(
          `<div q-date-picker-error-text>Projected error</div>`,
          `invalid errorText="Ignored"`,
        ),
      ),
    )

    await expect.element(page.getByText("Projected error")).toBeVisible()
    await expect.element(page.getByText("Ignored")).not.toBeInTheDocument()
  })

  test("a projected control replaces the default field", async () => {
    await render(
      host(
        field(`
          <div q-date-picker-control>
            <div label="Projected" q-date-picker-input-group></div>
          </div>
        `),
      ),
    )

    await expect
      .element(page.getByRole("textbox", {name: /projected/i}))
      .toBeVisible()
  })

  test("a projected input group carries its own separator", async () => {
    await render(
      host(
        field(
          `<div q-date-picker-input-group label="Trip" separator="to"></div>`,
          `selectionMode="range"`,
        ),
      ),
    )

    await expect.element(page.getByText("to", {exact: true})).toBeVisible()
  })

  test("a projected headline value carries its own placeholder", async () => {
    await render(
      host(
        inline(
          `<span q-date-picker-headline-value placeholder="Nothing picked"></span>`,
        ),
      ),
    )

    await expect.element(page.getByText("Nothing picked")).toBeVisible()
  })

  test("a projected headline replaces the whole headline", async () => {
    await render(
      host(
        inline(`
          <div q-date-picker-headline>
            <span q-date-picker-headline-label></span>
            <span q-date-picker-headline-value moreLabel="ignored"></span>
          </div>
        `),
      ),
    )

    await expect.element(page.getByText("Select date")).toBeVisible()
  })

  test("a projected headline label replaces the default", async () => {
    await render(
      host(inline(`<span q-date-picker-headline-label>Pick a day</span>`)),
    )

    await expect.element(page.getByText("Pick a day")).toBeVisible()
  })

  test("a projected headline survives headline=false", async () => {
    await render(
      host(
        inline(
          `
          <div q-date-picker-headline>
            <span q-date-picker-headline-label>Custom caption</span>
          </div>
        `,
          `[headline]="false"`,
        ),
      ),
    )

    await expect.element(page.getByText("Custom caption")).toBeVisible()
  })

  test("headline=false still drops the default headline", async () => {
    await render(host(inline("", `[headline]="false"`)))

    await expect.element(page.getByText("Select date")).not.toBeInTheDocument()
  })

  test("a projected presets block replaces the default", async () => {
    await render(
      host(
        inline(`
          <div q-date-picker-presets>
            <button q-date-picker-preset-trigger value="next7Days">
              Coming week
            </button>
          </div>
        `),
      ),
    )
    await page.getByRole("button", {name: /presets/i}).click()

    await expect.element(page.getByText("Coming week")).toBeVisible()
  })

  test("a projected actions block replaces the default footer", async () => {
    await render(
      host(
        field(
          `
          <div q-date-picker-actions>
            <button q-date-picker-cancel-trigger>Nope</button>
            <button q-date-picker-ok-trigger>Confirm</button>
          </div>
        `,
          `[closeOnSelect]="false"`,
        ),
      ),
    )
    await openCalendar()

    await expect.element(page.getByText("Confirm")).toBeVisible()
    await expect.element(page.getByText("Nope")).toBeVisible()
  })

  test("projected actions render even without an actions-forcing input", async () => {
    await render(
      host(
        field(`
          <div q-date-picker-actions>
            <button q-date-picker-cancel-trigger>Nope</button>
            <button q-date-picker-ok-trigger>Confirm</button>
          </div>
        `),
      ),
    )
    await openCalendar()

    await expect.element(page.getByText("Confirm")).toBeVisible()
  })

  test("projected actions are suppressed for the inline variant", async () => {
    await render(
      host(
        inline(`
          <div q-date-picker-actions>
            <button q-date-picker-cancel-trigger>Nope</button>
            <button q-date-picker-ok-trigger>Confirm</button>
          </div>
        `),
      ),
    )

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect.element(page.getByText("Confirm")).not.toBeInTheDocument()
  })

  test("the defaults still render when nothing is projected", async () => {
    await render(host(field("", `hint="Default hint"`)))

    await expect.element(page.getByText("Default hint")).toBeVisible()

    await openCalendar()

    await expect.element(page.getByRole("grid")).toBeVisible()
  })
})
