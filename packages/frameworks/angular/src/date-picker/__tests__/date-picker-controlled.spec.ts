import {Component, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {FormControl, ReactiveFormsModule} from "@angular/forms"
import {render} from "@testing-library/angular"
import {beforeEach, describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {
  type DatePickerPreset,
  DatePickerModule,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/angular/date-picker"

const seeded = parseDate("2024-06-15")
const grid = () => page.getByRole("grid")
const input = () => page.getByRole("textbox")
const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

async function openAndWait() {
  await openCalendar()
  await expect.element(grid()).toBeVisible()
}

async function openAndWaitForFocus() {
  await openAndWait()
  await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
}

const openChanged = vi.fn()
const focusChanged = vi.fn()

function controlledValueTemplate() {
  return `
    <q-date-picker
      label="Departure date"
      [closeOnSelect]="false"
      [formControl]="departure"
    />
  `
}

function parentDrivenTemplate() {
  return `
    <button type="button" (click)="jump()">Jump</button>
    ${controlledValueTemplate()}
  `
}

function frozenOpenTemplate() {
  return `
    <q-date-picker
      label="Departure date"
      [open]="false"
      (openChanged)="openChanged($event)"
    />
  `
}

function controlledOpenTemplate(rootAttrs: string) {
  return `
    <q-date-picker
      label="Departure date"
      [defaultFocusedValue]="seeded"
      [open]="open()"
      (openChanged)="open.set($event.open)"
      ${rootAttrs}
    />
  `
}

function frozenViewTemplate() {
  return `
    <q-date-picker
      label="Departure date"
      view="month"
      [defaultFocusedValue]="seeded"
    />
  `
}

function frozenFocusedValueTemplate() {
  return `
    <q-date-picker
      label="Departure date"
      [focusedValue]="seeded"
      (focusChanged)="focusChanged($event)"
    />
  `
}

/**
 * Angular has no `value` input; the controlled value arrives through a form
 * control. A control the parent writes the previous value back to is the closest
 * analogue of React's frozen `value` prop.
 */
@Component({
  imports: [DatePickerModule, ReactiveFormsModule],
  template: controlledValueTemplate(),
})
class RejectingControlComponent {
  readonly departure = new FormControl<(DateValue | null)[]>([seeded])

  constructor() {
    this.departure.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.departure.setValue([seeded], {emitEvent: false})
    })
  }
}

@Component({
  imports: [DatePickerModule, ReactiveFormsModule],
  template: parentDrivenTemplate(),
})
class ParentDrivenControlComponent {
  readonly departure = new FormControl<(DateValue | null)[]>([seeded])

  jump() {
    this.departure.setValue([parseDate("2024-06-20")])
  }
}

@Component({
  imports: [DatePickerModule],
  template: frozenOpenTemplate(),
})
class FrozenOpenComponent {
  readonly openChanged = openChanged
}

function controlledOpen(rootAttrs = "") {
  @Component({
    imports: [DatePickerModule],
    template: controlledOpenTemplate(rootAttrs),
  })
  class ControlledOpenComponent {
    readonly open = signal(false)
    readonly presets: DatePickerPreset[] = [
      {label: "Next 7 days", value: "next7Days"},
    ]
    readonly seeded = seeded
  }
  return ControlledOpenComponent
}

@Component({
  imports: [DatePickerModule],
  template: frozenViewTemplate(),
})
class FrozenViewComponent {
  readonly seeded = seeded
}

@Component({
  imports: [DatePickerModule],
  template: frozenFocusedValueTemplate(),
})
class FrozenFocusedValueComponent {
  readonly focusChanged = focusChanged
  readonly seeded = seeded
}

describe("DatePicker - Controlled", () => {
  beforeEach(() => {
    openChanged.mockClear()
    focusChanged.mockClear()
  })

  test("a form control that rejects the change keeps the previous value in the field", async () => {
    await render(RejectingControlComponent)
    await openAndWait()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(input()).toHaveValue("06/15/2024")
  })

  test("a form control driven by the parent updates the field and the selected cell", async () => {
    await render(ParentDrivenControlComponent)
    await expect.element(input()).toHaveValue("06/15/2024")

    await page.getByRole("button", {name: "Jump"}).click()

    await expect.element(input()).toHaveValue("06/20/2024")

    await openCalendar()
    await expect.element(grid()).toBeVisible()
    await expect
      .element(page.getByLabelText(/June 20, 2024/))
      .toHaveAttribute("data-selected")
    await expect
      .element(page.getByLabelText(/June 15, 2024/))
      .not.toHaveAttribute("data-selected")
  })

  test("a frozen open input keeps the calendar closed while still reporting the intent", async () => {
    await render(FrozenOpenComponent)

    await openCalendar()

    expect(openChanged).toHaveBeenCalledWith(
      expect.objectContaining({open: true}),
    )
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("an open input driven by the parent opens and closes the calendar", async () => {
    await render(controlledOpen())
    await expect.element(grid()).not.toBeInTheDocument()

    await openAndWaitForFocus()

    await userEvent.keyboard("{Escape}")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("a controlled open picker still commits the selected date", async () => {
    await render(controlledOpen())
    await openAndWait()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(input()).toHaveValue("06/20/2024")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("clicking the input keeps focus in the input, even when open is controlled", async () => {
    await render(controlledOpen("openOnClick"))

    await input().click()

    await expect.element(grid()).toBeVisible()
    await expect.element(input()).toHaveFocus()
  })

  test("a controlled open still moves focus into the grid when opened by the trigger", async () => {
    await render(controlledOpen())

    await openCalendar()

    await expect.element(grid()).toBeVisible()
    await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
  })

  test("a controlled close after a selection keeps focus in the picker", async () => {
    await render(controlledOpen())
    await openAndWait()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(input()).toHaveFocus()
  })

  test("a controlled close after Enter keeps focus in the picker", async () => {
    await render(controlledOpen())
    await openAndWaitForFocus()

    await userEvent.keyboard("{Enter}")

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(input()).toHaveFocus()
  })

  test("a controlled close after Escape keeps focus in the picker", async () => {
    await render(controlledOpen())
    await openAndWaitForFocus()

    await userEvent.keyboard("{Escape}")

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(input()).toHaveFocus()
  })

  test("a controlled selection does not leak focus restoration into the next close", async () => {
    await render(controlledOpen())

    await openAndWait()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(grid()).not.toBeInTheDocument()

    await openAndWait()
    await page.getByRole("button", {name: /close calendar/i}).click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", {name: /open calendar/i}))
      .toHaveFocus()
  })

  test("a controlled close after a preset keeps focus in the picker", async () => {
    await render(controlledOpen(`selectionMode="range" [presets]="presets"`))
    await openAndWait()

    await page.getByRole("button", {name: /show presets/i}).click()
    await page.getByText("Next 7 days").click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("textbox", {name: /end date/i}))
      .toHaveFocus()
  })

  test("a frozen view input pins the calendar to that level", async () => {
    await render(FrozenViewComponent)
    await openAndWait()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", "calendar year")

    await page.getByRole("button", {name: /return to calendar/i}).click()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", "calendar year")
  })

  test("a frozen focusedValue input ignores keyboard navigation", async () => {
    await render(FrozenFocusedValueComponent)
    await openAndWait()

    await userEvent.keyboard("{ArrowRight}")

    expect(focusChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        focusedValue: expect.objectContaining({day: 16}),
      }),
    )
    await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
  })
})
