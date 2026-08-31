import {Component, output} from "@angular/core"
import {
  FormControl,
  type FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {beforeEach, describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {
  DatePickerModule,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/angular/date-picker"
import type {DatePickerValueChangeDetails} from "@qualcomm-ui/core/date-picker"

const seeded = parseDate("2024-06-15")
const submitted = vi.fn<(data: FormData) => void>()
const submit = () => page.getByRole("button", {name: "Submit"}).click()
const reset = () => page.getByRole("button", {name: "Reset"}).click()

const doc = () =>
  page.getByRole("button", {name: "Submit"}).element().ownerDocument

const isRootDisabled = () =>
  doc()
    .querySelector('[data-date-picker-part="root"]')
    ?.hasAttribute("data-disabled")

function formTemplate(picker: string) {
  return `
    <form (submit)="onSubmit($event)">
      ${picker}
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  `
}

function fieldsetTemplate(picker: string) {
  return `
    <form (submit)="onSubmit($event)">
      <fieldset [disabled]="fieldsetDisabled">
        ${picker}
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  `
}

function reactiveTemplate(pickerAttrs: string) {
  return `
    <output data-test-id="status">{{ state }}</output>
    <q-date-picker
      label="Departure"
      [defaultFocusedValue]="seeded"
      [formControl]="departure"
      ${pickerAttrs}
    />
  `
}

function formHost(picker: string) {
  @Component({
    imports: [DatePickerModule],
    template: formTemplate(picker),
  })
  class FormHostComponent {
    readonly endOnlyRange: (DateValue | null)[] = [
      null,
      parseDate("2024-06-20"),
    ]
    readonly range = [parseDate("2024-06-10"), parseDate("2024-06-20")]
    readonly seeded = seeded
    readonly submitted = submitted
    readonly value = [seeded]
    readonly valueChangedHandler = output<DatePickerValueChangeDetails>()

    onSubmit(event: Event) {
      event.preventDefault()
      this.submitted(new FormData(event.target as HTMLFormElement))
    }
  }
  return FormHostComponent
}

function fieldsetHost(picker: string) {
  @Component({
    imports: [DatePickerModule],
    template: fieldsetTemplate(picker),
  })
  class FieldsetHostComponent {
    fieldsetDisabled = true
    readonly seeded = seeded
    readonly submitted = submitted
    readonly value = [seeded]

    onSubmit(event: Event) {
      event.preventDefault()
      this.submitted(new FormData(event.target as HTMLFormElement))
    }
  }
  return FieldsetHostComponent
}

function reactiveHost(
  pickerAttrs = "",
  controlOptions: FormControlOptions = {validators: [Validators.required]},
) {
  @Component({
    imports: [DatePickerModule, ReactiveFormsModule],
    template: reactiveTemplate(pickerAttrs),
  })
  class ReactiveHostComponent {
    readonly departure = new FormControl<(DateValue | null)[]>(
      [],
      controlOptions,
    )
    readonly seeded = seeded

    get state() {
      return [
        this.departure.value?.join(","),
        this.departure.valid,
        this.departure.dirty,
        this.departure.touched,
      ].join("|")
    }
  }
  return ReactiveHostComponent
}

const blurUpdateHost = () =>
  reactiveHost("", {updateOn: "blur", validators: [Validators.required]})

const optionalReactiveHost = (pickerAttrs = "") => reactiveHost(pickerAttrs, {})

function toggleableRangeHost() {
  @Component({
    imports: [DatePickerModule, ReactiveFormsModule],
    template: `
      <form [formGroup]="trip">
        <output data-test-id="status">{{ state }}</output>
        @if (show) {
          <q-date-picker
            formControlName="departure"
            label="Departure"
            selectionMode="range"
            [defaultFocusedValue]="seeded"
          />
        }
      </form>
      <button type="button" (click)="show = false">Hide</button>
      <button type="button" (click)="revalidate()">Revalidate</button>
    `,
  })
  class ToggleableRangeHostComponent {
    show = true
    readonly trip = new FormGroup({
      departure: new FormControl<(DateValue | null)[]>([], {
        validators: [Validators.required],
      }),
    })
    readonly seeded = seeded

    get state() {
      return [
        this.trip.controls.departure.value?.join(","),
        this.trip.valid,
      ].join("|")
    }

    revalidate() {
      this.trip.controls.departure.updateValueAndValidity()
    }
  }
  return ToggleableRangeHostComponent
}

const status = () => page.getByTestId("status")
const startInput = () => page.getByRole("textbox", {name: /start date/i})
const endInput = () => page.getByRole("textbox", {name: /end date/i})

describe("DatePicker - Form", () => {
  beforeEach(() => {
    submitted.mockClear()
  })

  test("a single picker submits its formatted value under the given name", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Departure"
          name="departure"
          [defaultValue]="value"
        />
      `),
    )

    await submit()

    expect(submitted).toHaveBeenCalledTimes(1)
    expect(submitted.mock.calls[0][0].getAll("departure")).toEqual([
      "06/15/2024",
    ])
  })

  test("a range picker submits both endpoints under the same name", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Trip"
          name="trip"
          selectionMode="range"
          [defaultValue]="range"
        />
      `),
    )

    await submit()

    expect(submitted.mock.calls[0][0].getAll("trip")).toEqual([
      "06/10/2024",
      "06/20/2024",
    ])
  })

  test("multiple mode submits one entry per selected date", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Dates"
          name="dates"
          selectionMode="multiple"
          [defaultValue]="range"
        />
      `),
    )

    await submit()

    expect(submitted.mock.calls[0][0].getAll("dates")).toEqual([
      "06/10/2024",
      "06/20/2024",
    ])
  })

  test("multiple mode submits an empty entry when nothing is selected", async () => {
    await render(
      formHost(
        `<q-date-picker label="Dates" name="dates" selectionMode="multiple" />`,
      ),
    )

    await submit()

    expect(submitted.mock.calls[0][0].getAll("dates")).toEqual([""])
  })

  test("required blocks submission of an empty single picker", async () => {
    await render(
      formHost(`<q-date-picker label="Departure" name="departure" required />`),
    )

    await submit()

    expect(submitted).not.toHaveBeenCalled()
  })

  test("required blocks submission of an empty multiple picker", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Dates"
          name="dates"
          required
          selectionMode="multiple"
        />
      `),
    )

    await submit()

    expect(submitted).not.toHaveBeenCalled()
  })

  test("a picked date satisfies required", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Departure"
          name="departure"
          required
          [defaultFocusedValue]="seeded"
        />
      `),
    )

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await submit()

    expect(submitted.mock.calls[0][0].getAll("departure")).toEqual([
      "06/20/2024",
    ])
  })

  test("a disabled picker is left out of the submitted data", async () => {
    await render(
      formHost(`
        <q-date-picker
          disabled
          label="Departure"
          name="departure"
          [defaultValue]="value"
        />
      `),
    )

    await submit()

    expect(submitted.mock.calls[0][0].getAll("departure")).toEqual([])
  })

  test("a required form control turns valid, dirty and touched once a date is selected", async () => {
    await render(reactiveHost())
    await expect.element(status()).toHaveTextContent("|false|false|false")

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect
      .element(status())
      .toHaveTextContent("2024-06-20|true|true|true")
    await expect.element(page.getByRole("textbox")).toHaveValue("06/20/2024")
  })

  test("a required range control stays invalid until both endpoints are selected", async () => {
    await render(reactiveHost(`selectionMode="range"`))
    await expect.element(status()).toHaveTextContent("|false|false|false")

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(status()).toHaveTextContent("2024-06-10|false")

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect
      .element(status())
      .toHaveTextContent("2024-06-10,2024-06-20|true")
  })

  test("a required range control rejects an end-only selection", async () => {
    await render(reactiveHost(`selectionMode="range"`))

    await endInput().fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(status()).toHaveTextContent(",2024-06-20|false")
  })

  test("destroying a picker releases the range constraint it put on the control", async () => {
    await render(toggleableRangeHost())

    await endInput().fill("06/20/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(status()).toHaveTextContent(",2024-06-20|false")

    await page.getByRole("button", {name: "Hide"}).click()
    await page.getByRole("button", {name: "Revalidate"}).click()

    await expect.element(status()).toHaveTextContent(",2024-06-20|true")
  })

  test("an optional range control accepts a partial selection", async () => {
    await render(optionalReactiveHost(`selectionMode="range"`))

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(status()).toHaveTextContent("2024-06-10|true")
  })

  test("closing the calendar without a selection only marks the control touched", async () => {
    await render(reactiveHost())

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await expect.element(page.getByRole("grid")).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("grid")).not.toBeInTheDocument()

    await expect.element(status()).toHaveTextContent("|false|false|true")
  })

  test("blurring the input marks the control touched without opening the calendar", async () => {
    await render(reactiveHost())

    await page.getByRole("textbox").click()
    await userEvent.keyboard("{Tab}")

    await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    await expect.element(status()).toHaveTextContent("|false|false|true")
  })

  test("an updateOn blur control commits the typed date when the input loses focus", async () => {
    await render(blurUpdateHost())

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Tab}")

    await expect
      .element(status())
      .toHaveTextContent("2024-06-20|true|true|true")
  })

  test("a form control's value survives a round trip through the input", async () => {
    await render(reactiveHost())

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect
      .element(status())
      .toHaveTextContent("2024-06-20|true|true|true")
  })

  test("resetting the form restores the initial value", async () => {
    const valueChanged = vi.fn()
    await render(
      formHost(`
        <q-date-picker
          label="Departure"
          name="departure"
          [defaultValue]="value"
          (valueChanged)="valueChangedHandler.emit($event)"
        />
      `),
      {on: {valueChangedHandler: (event: unknown) => valueChanged(event)}},
    )

    const input = page.getByRole("textbox")
    await input.fill("06/20/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(input).toHaveValue("06/20/2024")

    valueChanged.mockClear()
    await reset()

    await expect.element(input).toHaveValue("06/15/2024")
    await expect
      .poll(() => valueChanged)
      .toHaveBeenCalledWith(
        expect.objectContaining({valueAsString: ["06/15/2024"]}),
      )
  })

  test("resetting the form clears a picker that had no initial value", async () => {
    await render(
      formHost(`<q-date-picker label="Departure" name="departure" />`),
    )

    const input = page.getByRole("textbox")
    await input.fill("06/20/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(input).toHaveValue("06/20/2024")

    await reset()

    await expect.element(input).toHaveValue("")
  })

  test("resetting the form restores both endpoints of a range", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Trip"
          name="trip"
          selectionMode="range"
          [defaultValue]="range"
        />
      `),
    )

    await startInput().fill("06/05/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(startInput()).toHaveValue("06/05/2024")

    await reset()

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("resetting the form restores which range endpoint is next", async () => {
    await render(
      formHost(`
        <q-date-picker
          label="Trip"
          selectionMode="range"
          name="trip"
          [defaultFocusedValue]="seeded"
        />
      `),
    )

    await startInput().fill("06/10/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(startInput()).toHaveValue("06/10/2024")

    await reset()
    await expect.element(startInput()).toHaveValue("")

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 12, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/12/2024")
    await expect.element(endInput()).toHaveValue("")
  })

  test("resetting an end-only range on an inline picker leaves the start slot next", async () => {
    const valueChanged = vi.fn()
    await render(
      formHost(`
        <q-date-picker
          label="Trip"
          selectionMode="range"
          variant="inline"
          [defaultFocusedValue]="seeded"
          [defaultValue]="endOnlyRange"
          (valueChanged)="valueChangedHandler.emit($event)"
        />
      `),
      {on: {valueChangedHandler: (event: unknown) => valueChanged(event)}},
    )

    await reset()
    valueChanged.mockClear()

    await page.getByRole("gridcell", {name: /June 12, 2024/}).click()

    await expect
      .poll(() => valueChanged.mock.calls.at(-1)?.[0].valueAsString)
      .toEqual(["06/12/2024", "06/20/2024"])
  })

  test("an ancestor disabled fieldset puts the picker in its disabled state", async () => {
    await render(
      fieldsetHost(`
        <q-date-picker
          label="Departure"
          name="departure"
          [defaultValue]="value"
        />
      `),
    )

    await expect.poll(() => isRootDisabled()).toBe(true)
  })

  test("re-enabling the fieldset returns the picker to its enabled state", async () => {
    await render(
      fieldsetHost(`
        <q-date-picker
          label="Departure"
          name="departure"
          [defaultValue]="value"
        />
      `),
    )

    await expect.poll(() => isRootDisabled()).toBe(true)

    doc().querySelector("fieldset")!.removeAttribute("disabled")

    await expect.poll(() => isRootDisabled()).toBe(false)
  })

  test("an ancestor disabled fieldset disables an inline picker", async () => {
    await render(
      fieldsetHost(`
        <q-date-picker
          label="Departure"
          name="departure"
          variant="inline"
          [defaultFocusedValue]="seeded"
        />
      `),
    )

    await expect.poll(() => isRootDisabled()).toBe(true)
  })
})
