import type {FormEvent} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {DatePicker, parseDate} from "@qualcomm-ui/react/date-picker"

const seeded = parseDate("2024-06-15")

function Form({
  children,
  onSubmit,
}: {
  children: React.ReactNode
  onSubmit?: (data: FormData) => void
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.(new FormData(event.currentTarget))
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  )
}

const submit = () => page.getByRole("button", {name: "Submit"}).click()
const reset = () => page.getByRole("button", {name: "Reset"}).click()

const isRootDisabled = () =>
  document
    .querySelector('[data-date-picker-part="root"]')
    ?.hasAttribute("data-disabled")

describe("DatePicker - Form", () => {
  test("a single picker submits its formatted value under the given name", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultValue={[seeded]}
          label="Departure"
          name="departure"
        />
      </Form>,
    )

    await submit()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([
      "06/15/2024",
    ])
  })

  test("a range picker submits both endpoints under the same name", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
          label="Trip"
          name="trip"
          selectionMode="range"
        />
      </Form>,
    )

    await submit()

    expect(onSubmit.mock.calls[0][0].getAll("trip")).toEqual([
      "06/10/2024",
      "06/20/2024",
    ])
  })

  test("multiple mode submits one entry per selected date", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
          label="Dates"
          name="dates"
          selectionMode="multiple"
        />
      </Form>,
    )

    await submit()

    expect(onSubmit.mock.calls[0][0].getAll("dates")).toEqual([
      "06/10/2024",
      "06/20/2024",
    ])
  })

  test("multiple mode submits an empty entry when nothing is selected", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker label="Dates" name="dates" selectionMode="multiple" />
      </Form>,
    )

    await submit()

    expect(onSubmit.mock.calls[0][0].getAll("dates")).toEqual([""])
  })

  test("required blocks submission of an empty single picker", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker label="Departure" name="departure" required />
      </Form>,
    )

    await submit()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("required blocks submission of an empty multiple picker", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          label="Dates"
          name="dates"
          required
          selectionMode="multiple"
        />
      </Form>,
    )

    await submit()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("a picked date satisfies required", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure"
          name="departure"
          required
        />
      </Form>,
    )

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await submit()

    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([
      "06/20/2024",
    ])
  })

  test("a disabled picker is left out of the submitted data", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultValue={[seeded]}
          disabled
          label="Departure"
          name="departure"
        />
      </Form>,
    )

    await submit()

    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([])
  })

  test("resetting the form restores the initial value", async () => {
    const onValueChange = vi.fn()
    await render(
      <Form>
        <DatePicker
          defaultValue={[parseDate("2024-06-10")]}
          label="Departure"
          name="departure"
          onValueChange={onValueChange}
        />
      </Form>,
    )

    const input = page.getByRole("textbox")
    await input.fill("07/15/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(input).toHaveValue("07/15/2024")

    onValueChange.mockClear()
    await reset()

    await expect.element(input).toHaveValue("06/10/2024")
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({valueAsString: ["06/10/2024"]}),
    )
  })

  test("resetting the form clears a picker that had no initial value", async () => {
    await render(
      <Form>
        <DatePicker label="Departure" name="departure" />
      </Form>,
    )

    const input = page.getByRole("textbox")
    await input.fill("07/15/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(input).toHaveValue("07/15/2024")

    await reset()

    await expect.element(input).toHaveValue("")
  })

  test("resetting the form restores both endpoints of a range", async () => {
    await render(
      <Form>
        <DatePicker
          defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
          label="Trip"
          name="trip"
          selectionMode="range"
        />
      </Form>,
    )

    const startInput = page.getByRole("textbox", {name: /start date/i})
    const endInput = page.getByRole("textbox", {name: /end date/i})

    await startInput.fill("06/05/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(startInput).toHaveValue("06/05/2024")

    await reset()

    await expect.element(startInput).toHaveValue("06/10/2024")
    await expect.element(endInput).toHaveValue("06/20/2024")
  })

  test("resetting the form restores which range endpoint is next", async () => {
    await render(
      <Form>
        <DatePicker
          defaultFocusedValue={seeded}
          label="Trip"
          name="trip"
          selectionMode="range"
        />
      </Form>,
    )

    const startInput = page.getByRole("textbox", {name: /start date/i})
    const endInput = page.getByRole("textbox", {name: /end date/i})

    await startInput.fill("06/10/2024")
    await userEvent.keyboard("{Enter}")
    await expect.element(startInput).toHaveValue("06/10/2024")

    await reset()
    await expect.element(startInput).toHaveValue("")

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 12, 2024/}).click()

    await expect.element(startInput).toHaveValue("06/12/2024")
    await expect.element(endInput).toHaveValue("")
  })

  test("resetting an end-only range on an inline picker leaves the start slot next", async () => {
    const onValueChange = vi.fn()
    await render(
      <Form>
        <DatePicker
          defaultFocusedValue={seeded}
          defaultValue={[null, parseDate("2024-06-20")]}
          label="Trip"
          onValueChange={onValueChange}
          selectionMode="range"
          variant="inline"
        />
      </Form>,
    )

    await reset()
    onValueChange.mockClear()

    await page.getByRole("gridcell", {name: /June 12, 2024/}).click()

    await expect
      .poll(() => onValueChange.mock.calls.at(-1)?.[0].valueAsString)
      .toEqual(["06/12/2024", "06/20/2024"])
  })

  test("an ancestor disabled fieldset puts the picker in its disabled state", async () => {
    await render(
      <Form>
        <fieldset disabled>
          <DatePicker
            defaultValue={[parseDate("2024-06-10")]}
            label="Departure"
            name="departure"
          />
        </fieldset>
      </Form>,
    )

    await expect.poll(() => isRootDisabled()).toBe(true)
  })

  test("re-enabling the fieldset returns the picker to its enabled state", async () => {
    await render(
      <Form>
        <fieldset disabled>
          <DatePicker
            defaultValue={[parseDate("2024-06-10")]}
            label="Departure"
            name="departure"
          />
        </fieldset>
      </Form>,
    )

    await expect.poll(() => isRootDisabled()).toBe(true)

    document.querySelector("fieldset")!.removeAttribute("disabled")

    await expect.poll(() => isRootDisabled()).toBe(false)
  })

  test("an ancestor disabled fieldset disables an inline picker", async () => {
    await render(
      <Form>
        <fieldset disabled>
          <DatePicker
            defaultFocusedValue={seeded}
            label="Departure"
            name="departure"
            variant="inline"
          />
        </fieldset>
      </Form>,
    )

    await expect.poll(() => isRootDisabled()).toBe(true)
  })
})
