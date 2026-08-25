import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"
import type {DatePickerApi} from "@qualcomm-ui/core/date-picker"

const seeded = parseDate("2024-06-15")

const valueChanged = vi.fn()

const dayView = `
  <div q-date-picker-view view="day">
    <table q-date-picker-table>
      <thead q-date-picker-day-grid-header></thead>
      <tbody q-date-picker-day-grid></tbody>
    </table>
  </div>
`

interface ApiHostConfig {
  /** Above the control, so the downward popover cannot cover it. */
  above?: string

  /** Inside `Content`; outside it, the click would dismiss before it lands. */
  inContent?: string
  rootAttrs?: string
}

function withContext(content: string | undefined) {
  return content
    ? `<ng-container *datePickerContext="let api">${content}</ng-container>`
    : ""
}

function apiHostTemplate(config: ApiHostConfig) {
  return `
    <div
      q-date-picker-root
      [defaultFocusedValue]="seeded"
      ${config.rootAttrs ?? ""}
    >
      ${withContext(config.above)}
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group></div>
      </div>
      <ng-template qPortal>
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            ${dayView}
            ${withContext(config.inContent)}
          </div>
        </div>
      </ng-template>
    </div>
  `
}

function inlineHostTemplate(above: string) {
  return `
    <div inline q-date-picker-root [defaultFocusedValue]="seeded">
      ${withContext(above)}
      <div q-date-picker-content>
        ${dayView}
        <div q-date-picker-view view="month">
          <table q-date-picker-table>
            <tbody q-date-picker-month-grid></tbody>
          </table>
        </div>
        <div q-date-picker-view view="year">
          <table q-date-picker-table>
            <tbody q-date-picker-year-grid></tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

function apiHost(config: ApiHostConfig) {
  @Component({
    imports: [DatePickerModule, PortalDirective],
    template: apiHostTemplate(config),
  })
  class ApiHostComponent {
    readonly d = parseDate
    readonly max = parseDate("2024-06-20")
    readonly maxOnly = parseDate("2020-01-31")
    readonly min = parseDate("2024-06-10")
    readonly output = signal("")
    readonly seeded = seeded
    readonly value = [seeded]
    readonly valueChanged = valueChanged

    resolvePreset(api: DatePickerApi) {
      this.output.set(
        api
          .getRangePresetValue("thisMonth")
          .map((date) => date.toString())
          .join(","),
      )
    }
  }
  return ApiHostComponent
}

function inlineHost(above: string) {
  @Component({
    imports: [DatePickerModule],
    template: inlineHostTemplate(above),
  })
  class InlineHostComponent {
    readonly d = parseDate
    readonly monthYear: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    }
    readonly output = signal("")
    readonly seeded = seeded
  }
  return InlineHostComponent
}

const input = () => page.getByRole("textbox")
const grid = () => page.getByRole("grid")
const status = () => page.getByTestId("status")
const act = (name: string) => page.getByRole("button", {name}).click()

describe("DatePicker - API", () => {
  beforeEach(() => {
    valueChanged.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test("selectToday uses the configured time zone", async () => {
    vi.setSystemTime(new Date("2024-06-01T00:30:00Z"))
    await render(
      apiHost({
        above: `<button type="button" (click)="api.selectToday()">Today</button>`,
        rootAttrs: `timeZone="America/Los_Angeles"`,
      }),
    )

    await act("Today")

    await expect.element(input()).toHaveValue("05/31/2024")
  })

  test("selectToday clamps to max when today is out of range", async () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"))
    await render(
      apiHost({
        above: `<button type="button" (click)="api.selectToday()">Today</button>`,
        rootAttrs: `[max]="maxOnly"`,
      }),
    )

    await act("Today")

    await expect.element(input()).toHaveValue("01/31/2020")
  })

  test("setValue constrains the given date to min and max", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.setValue([d('2024-06-25')])">Set</button>`,
        rootAttrs: `[max]="max" [min]="min"`,
      }),
    )

    await act("Set")

    await expect.element(input()).toHaveValue("06/20/2024")
  })

  test("setValue orders a reversed range instead of storing it as given", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.setValue([d('2024-06-20'), d('2024-06-10')])">Set</button>`,
        rootAttrs: `selectionMode="range" (valueChanged)="valueChanged($event)"`,
      }),
    )

    await act("Set")

    expect(valueChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        valueAsString: ["06/10/2024", "06/20/2024"],
      }),
    )
  })

  test("setValue keeps only the first date in single mode", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.setValue([d('2024-06-10'), d('2024-06-20')])">Set</button>`,
        rootAttrs: `(valueChanged)="valueChanged($event)"`,
      }),
    )

    await act("Set")

    expect(valueChanged).toHaveBeenCalledWith(
      expect.objectContaining({valueAsString: ["06/10/2024"]}),
    )
  })

  test("clearValue empties the selection", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.clearValue()">Wipe</button>`,
        rootAttrs: `[defaultValue]="value"`,
      }),
    )
    await expect.element(input()).toHaveValue("06/15/2024")

    await act("Wipe")

    await expect.element(input()).toHaveValue("")
  })

  test("setOpen drives the calendar without a trigger click", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.setOpen(true)">Show</button>`,
        inContent: `<button type="button" (click)="api.setOpen(false)">Hide</button>`,
      }),
    )

    await act("Show")
    await expect.element(grid()).toBeVisible()

    await act("Hide")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("setFocusedValue moves the visible month", async () => {
    await render(
      inlineHost(
        `<button type="button" (click)="api.setFocusedValue(d('2024-09-05'))">Jump</button>`,
      ),
    )
    await expect
      .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
      .toBeVisible()

    await act("Jump")

    await expect
      .element(page.getByRole("gridcell", {name: /September 5, 2024/}))
      .toBeVisible()
    await expect
      .element(page.getByLabelText(/September 5, 2024/))
      .toHaveAttribute("data-focus")
  })

  test("toggleValue adds then removes a date in multiple mode", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.toggleValue(d('2024-06-20'))">Toggle</button>`,
        rootAttrs: `selectionMode="multiple" (valueChanged)="valueChanged($event)"`,
      }),
    )

    await act("Toggle")
    expect(valueChanged).toHaveBeenLastCalledWith(
      expect.objectContaining({valueAsString: ["06/20/2024"]}),
    )

    await act("Toggle")
    expect(valueChanged).toHaveBeenLastCalledWith(
      expect.objectContaining({valueAsString: []}),
    )
  })

  test("toggleValue is ignored while readOnly", async () => {
    await render(
      apiHost({
        above: `<button type="button" (click)="api.toggleValue(d('2024-06-20'))">Toggle</button>`,
        rootAttrs: `readOnly selectionMode="multiple" (valueChanged)="valueChanged($event)"`,
      }),
    )

    await act("Toggle")

    expect(valueChanged).not.toHaveBeenCalled()
  })

  test("setTime attaches a time to the selected date and keeps it on reselection", async () => {
    await render(
      apiHost({
        above: `
          <output data-test-id="status">{{ api.value[0]?.toString() }}</output>
          <button type="button" (click)="api.setTime({hour: 9, minute: 30})">
            Set time
          </button>
        `,
        rootAttrs: `[closeOnSelect]="false" [defaultValue]="value"`,
      }),
    )

    await act("Set time")
    await expect.element(input()).toHaveValue("06/15/2024")
    await expect.element(status()).toHaveTextContent("2024-06-15T09:30")

    await act("Change date")
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(input()).toHaveValue("06/20/2024")
    await expect.element(status()).toHaveTextContent("2024-06-20T09:30")
  })

  test("cancel reverts to the value the calendar opened with", async () => {
    await render(
      apiHost({
        inContent: `<button type="button" (click)="api.cancel()">Discard</button>`,
        rootAttrs: `[closeOnSelect]="false" [defaultValue]="[d('2024-06-10')]"`,
      }),
    )

    await act("Change date")
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(input()).toHaveValue("06/20/2024")

    await act("Discard")

    await expect.element(input()).toHaveValue("06/10/2024")
  })

  test("getRangePresetValue resolves a named preset to a pair of dates", async () => {
    vi.setSystemTime(new Date("2024-06-20T12:00:00Z"))
    await render(
      apiHost({
        above: `
          <output data-test-id="status">{{ output() }}</output>
          <button type="button" (click)="resolvePreset(api)">Resolve</button>
        `,
        rootAttrs: `selectionMode="range" timeZone="UTC"`,
      }),
    )

    await act("Resolve")

    await expect.element(status()).toHaveTextContent("2024-06-01,2024-06-20")
  })

  test("setView jumps straight to the requested level", async () => {
    await render(
      inlineHost(
        `<button type="button" (click)="api.setView('year')">Decade</button>`,
      ),
    )
    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", "calendar month")

    await act("Decade")

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", "calendar decade")
  })

  test("goToNext and goToPrev step the visible month", async () => {
    await render(
      inlineHost(`
        <button type="button" (click)="api.goToNext()">Next</button>
        <button type="button" (click)="api.goToPrev()">Prev</button>
      `),
    )

    await act("Next")
    await expect
      .element(page.getByRole("gridcell", {name: /July 15, 2024/}))
      .toBeVisible()

    await act("Prev")
    await expect
      .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
      .toBeVisible()
  })

  test("focusMonth and focusYear move the visible range", async () => {
    await render(
      inlineHost(`
        <button type="button" (click)="api.focusMonth(9)">Month</button>
        <button type="button" (click)="api.focusYear(2026)">Year</button>
      `),
    )

    await act("Month")
    await expect
      .element(page.getByRole("gridcell", {name: /September 15, 2024/}))
      .toBeVisible()

    await act("Year")
    await expect
      .element(page.getByRole("gridcell", {name: /September 15, 2026/}))
      .toBeVisible()
  })

  test("format renders a date with the given options", async () => {
    await render(
      inlineHost(`
        <output data-test-id="status">{{ api.format(seeded, monthYear) }}</output>
      `),
    )

    await expect.element(status()).toHaveTextContent("June 2024")
  })

  test("the api exposes the readable state of the picker", async () => {
    await render(
      inlineHost(`
        <output data-test-id="status">
          {{ api.view }}|{{ api.selectionMode }}|{{ api.inline }}|{{
            api.focusedValueAsString
          }}|{{ api.valueAsString.length }}
        </output>
      `),
    )

    await expect
      .element(status())
      .toHaveTextContent("day|single|true|06/15/2024|0")
  })
})
