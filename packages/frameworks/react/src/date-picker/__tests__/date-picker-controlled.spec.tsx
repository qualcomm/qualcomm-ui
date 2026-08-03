import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import type {DateValue} from "@qualcomm-ui/core/date-picker"
import {
  DatePicker,
  type DatePickerProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

const seeded = parseDate("2024-06-15")
const grid = () => page.getByRole("grid")
const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

describe("DatePicker - Controlled", () => {
  test("a frozen value prop ignores a selection made in the calendar", async () => {
    const onValueChange = vi.fn()
    await render(
      <DatePicker
        closeOnSelect={false}
        label="Departure date"
        onValueChange={onValueChange}
        value={[seeded]}
      />,
    )
    await openCalendar()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({valueAsString: ["06/20/2024"]}),
    )
    await expect.element(page.getByRole("textbox")).toHaveValue("06/15/2024")
  })

  test("a value prop driven by the parent updates the field and the selected cell", async () => {
    function Controlled() {
      const [value, setValue] = useState<(DateValue | null)[]>([seeded])
      return (
        <>
          <button onClick={() => setValue([parseDate("2024-06-20")])}>
            Jump
          </button>
          <DatePicker
            closeOnSelect={false}
            label="Departure date"
            value={value}
          />
        </>
      )
    }

    await render(<Controlled />)
    await expect.element(page.getByRole("textbox")).toHaveValue("06/15/2024")

    await page.getByRole("button", {name: "Jump"}).click()

    await expect.element(page.getByRole("textbox")).toHaveValue("06/20/2024")

    await openCalendar()
    await expect.element(grid()).toBeVisible()
    await expect
      .element(page.getByLabelText(/June 20, 2024/))
      .toHaveAttribute("data-selected")
    await expect
      .element(page.getByLabelText(/June 15, 2024/))
      .not.toHaveAttribute("data-selected")
  })

  test("a frozen open prop keeps the calendar closed while still reporting the intent", async () => {
    const onOpenChange = vi.fn()
    await render(
      <DatePicker
        label="Departure date"
        onOpenChange={onOpenChange}
        open={false}
      />,
    )

    await openCalendar()

    expect(onOpenChange).toHaveBeenCalledWith(
      expect.objectContaining({open: true}),
    )
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("an open prop driven by the parent opens and closes the calendar", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
        />
      )
    }

    await render(<Controlled />)
    await expect.element(grid()).not.toBeInTheDocument()

    await openCalendar()
    await expect.element(grid()).toBeVisible()

    await userEvent.keyboard("{Escape}")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("a controlled open picker still commits the selected date", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
        />
      )
    }

    await render(<Controlled />)
    await openCalendar()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByRole("textbox")).toHaveValue("06/20/2024")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("clicking the input keeps focus in the input, even when open is controlled", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
          openOnClick
        />
      )
    }

    await render(<Controlled />)

    await page.getByRole("textbox").click()

    await expect.element(grid()).toBeVisible()
    await expect.element(page.getByRole("textbox")).toHaveFocus()
  })

  test("a controlled open still moves focus into the grid when opened by the trigger", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
        />
      )
    }

    await render(<Controlled />)

    await openCalendar()

    await expect.element(grid()).toBeVisible()
    await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
  })

  test("a controlled close keeps focus in the picker on every closing path", async () => {
    function Controlled({...props}: Partial<DatePickerProps>) {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
          {...props}
        />
      )
    }

    const input = page.getByRole("textbox")

    const {unmount} = await render(<Controlled />)
    await openCalendar()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(input).toHaveFocus()
    await unmount()

    const second = await render(<Controlled />)
    await openCalendar()
    await userEvent.keyboard("{Enter}")
    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(input).toHaveFocus()
    await second.unmount()

    await render(<Controlled />)
    await openCalendar()
    await userEvent.keyboard("{Escape}")
    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(input).toHaveFocus()
  })

  test("a controlled selection does not leak focus restoration into the next close", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
        />
      )
    }

    await render(<Controlled />)

    await openCalendar()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(grid()).not.toBeInTheDocument()

    await openCalendar()
    await page.getByRole("button", {name: /close calendar/i}).click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", {name: /open calendar/i}))
      .toHaveFocus()
  })

  test("a controlled close after a preset keeps focus in the picker", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <DatePicker
          defaultFocusedValue={seeded}
          label="Trip"
          onOpenChange={(details) => setOpen(details.open)}
          open={open}
          presets={[{label: "Next 7 days", value: "next7Days"}]}
          selectionMode="range"
        />
      )
    }

    await render(<Controlled />)
    await openCalendar()

    await page.getByRole("button", {name: /show presets/i}).click()
    await page.getByText("Next 7 days").click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("textbox", {name: /end date/i}))
      .toHaveFocus()
  })

  test("a frozen view prop pins the calendar to that level", async () => {
    await render(
      <DatePicker
        defaultFocusedValue={seeded}
        label="Departure date"
        view="month"
      />,
    )
    await openCalendar()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", "calendar year")

    await page.getByRole("button", {name: /return to calendar/i}).click()

    await expect
      .element(grid())
      .toHaveAttribute("aria-roledescription", "calendar year")
  })

  test("a frozen focusedValue prop ignores keyboard navigation", async () => {
    const onFocusChange = vi.fn()
    await render(
      <DatePicker
        focusedValue={seeded}
        label="Departure date"
        onFocusChange={onFocusChange}
      />,
    )
    await openCalendar()

    await userEvent.keyboard("{ArrowRight}")

    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({
        focusedValue: expect.objectContaining({day: 16}),
      }),
    )
    await expect.element(page.getByLabelText(/June 15, 2024/)).toHaveFocus()
  })
})
