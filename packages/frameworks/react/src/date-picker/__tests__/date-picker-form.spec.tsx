import type {FormEvent} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {DatePicker, isWeekend, parseDate} from "@qualcomm-ui/react/date-picker"

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
const grid = () => page.getByRole("grid")
const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()
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

  test("pressing Enter on a typed date in a closed picker submits it", async () => {
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

    const input = page.getByRole("textbox")
    await input.fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([
      "06/20/2024",
    ])
    await expect.element(input).toHaveValue("06/20/2024")
  })

  test("pressing Enter on a value that reformats submits the formatted value", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker label="Departure" name="departure" />
      </Form>,
    )

    await page.getByRole("textbox").fill("6/2/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([
      "06/02/2024",
    ])
  })

  test("pressing Enter on a date before min submits the constrained value", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          label="Departure"
          min={parseDate("2024-06-10")}
          name="departure"
        />
      </Form>,
    )

    await page.getByRole("textbox").fill("06/01/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([
      "06/10/2024",
    ])
  })

  test("pressing Enter with an empty input submits the form", async () => {
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

    const input = page.getByRole("textbox")
    await input.fill("")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([""])
  })

  test("pressing Enter with an empty input does not submit a required picker", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker label="Departure" name="departure" required />
      </Form>,
    )

    await page.getByRole("textbox").fill("")
    await userEvent.keyboard("{Enter}")

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("pressing Enter on an unparseable value neither commits nor submits", async () => {
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

    const input = page.getByRole("textbox")
    // letters are stripped by the input, so an invalid date needs digits
    await input.fill("13/45/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input).toHaveValue("06/15/2024")
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("pressing Enter on a date blocked by isDateUnavailable neither commits nor submits", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultValue={[seeded]}
          isDateUnavailable={isWeekend}
          label="Departure"
          name="departure"
        />
      </Form>,
    )

    const input = page.getByRole("textbox")
    // June 16 2024 is a Sunday
    await input.fill("06/16/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input).toHaveValue("06/15/2024")
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("pressing Enter commits the value before the form submits", async () => {
    const order: string[] = []
    await render(
      <Form onSubmit={() => order.push("submitted")}>
        <DatePicker
          label="Departure"
          name="departure"
          onValueChange={() => order.push("valueChanged")}
        />
      </Form>,
    )

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => order).toEqual(["valueChanged", "submitted"])
  })

  test("pressing Enter with the calendar open submits and closes it", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure"
          name="departure"
        />
      </Form>,
    )

    await openCalendar()
    await expect.element(grid()).toBeVisible()

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("departure")).toEqual([
      "06/20/2024",
    ])
  })

  test("pressing Enter on one endpoint of an incomplete range submits and keeps the calendar open", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultFocusedValue={seeded}
          label="Trip"
          name="trip"
          selectionMode="range"
        />
      </Form>,
    )

    await openCalendar()
    await page.getByRole("textbox", {name: /start date/i}).fill("06/12/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(grid()).toBeVisible()
    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("trip")).toEqual(["06/12/2024", ""])
  })

  test("pressing Enter on the last missing endpoint submits both and closes", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          defaultValue={[parseDate("2024-06-10")]}
          label="Trip"
          name="trip"
          selectionMode="range"
        />
      </Form>,
    )

    await openCalendar()
    await page.getByRole("textbox", {name: /end date/i}).fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("trip")).toEqual([
      "06/10/2024",
      "06/20/2024",
    ])
  })

  test("pressing Enter on a reversed range submits the reordered endpoints", async () => {
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

    await openCalendar()
    await page.getByRole("textbox", {name: /end date/i}).fill("06/05/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].getAll("trip")).toEqual([
      "06/05/2024",
      "06/10/2024",
    ])
  })

  test("pressing Enter on a rejected date leaves an open calendar open and does not submit", async () => {
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

    await openCalendar()
    await page.getByRole("textbox").fill("13/45/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(grid()).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("with closeOnSelect false, pressing Enter commits without submitting", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    const onValueChange = vi.fn()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          closeOnSelect={false}
          defaultFocusedValue={seeded}
          label="Departure"
          name="departure"
          onValueChange={onValueChange}
        />
      </Form>,
    )

    await openCalendar()
    const input = page.getByRole("textbox")
    await input.fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input).toHaveValue("06/20/2024")
    await expect.element(grid()).toBeVisible()
    await expect.poll(() => onValueChange).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("with closeOnSelect false, pressing Enter on a cleared input does not submit", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          closeOnSelect={false}
          defaultValue={[seeded]}
          label="Departure"
          name="departure"
        />
      </Form>,
    )

    await openCalendar()
    await page.getByRole("textbox").fill("")
    await userEvent.keyboard("{Enter}")

    await expect.element(grid()).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("Enter during IME composition neither commits nor submits", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    const onValueChange = vi.fn()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker
          label="Departure"
          name="departure"
          onValueChange={onValueChange}
        />
      </Form>,
    )

    const inputEl = document.querySelector(
      "input[name='departure']",
    ) as HTMLInputElement
    inputEl.focus()
    inputEl.value = "06/20/2024"
    // the IME needs this keystroke, so it must be neither acted on nor cancelled
    const notCancelled = inputEl.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        isComposing: true,
        key: "Enter",
      }),
    )

    expect(notCancelled).toBe(true)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("Enter submits through the form's default button", async () => {
    const submitter = vi.fn<(el: Element | null) => void>()
    await render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submitter((event.nativeEvent as SubmitEvent).submitter)
        }}
      >
        <DatePicker label="Departure" name="departure" />
        <button name="action" type="submit" value="save">
          Save
        </button>
      </form>,
    )

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => submitter).toHaveBeenCalledTimes(1)
    expect(submitter.mock.calls[0][0]).toBe(
      page.getByRole("button", {name: "Save"}).element(),
    )
  })

  test("Enter runs the default button's own click handler", async () => {
    const onClick = vi.fn()
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <Form onSubmit={onSubmit}>
        <DatePicker label="Departure" name="departure" />
        <button onClick={onClick} type="submit">
          Save
        </button>
      </Form>,
    )

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onClick).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  test("Enter honours formNoValidate on the default button", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(new FormData(event.currentTarget))
        }}
      >
        <DatePicker label="Departure" name="departure" required />
        <button formNoValidate type="submit">
          Submit
        </button>
      </form>,
    )

    await page.getByRole("textbox").fill("")
    await userEvent.keyboard("{Enter}")

    await expect.poll(() => onSubmit).toHaveBeenCalledTimes(1)
  })

  test("Enter does not submit when the default button is disabled", async () => {
    const onSubmit = vi.fn<(data: FormData) => void>()
    await render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(new FormData(event.currentTarget))
        }}
      >
        <DatePicker label="Departure" name="departure" />
        <button disabled type="submit">
          Submit
        </button>
      </form>,
    )

    await page.getByRole("textbox").fill("06/20/2024")
    await userEvent.keyboard("{Enter}")

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
