import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerPreset,
  type DatePickerProps,
  type DatePickerRootProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

const seeded = parseDate("2024-06-15")

const presets: DatePickerPreset[] = [
  {label: "Next 7 days", value: "next7Days"},
  {label: "This month", value: "thisMonth"},
  {
    label: "Fixed span",
    value: [parseDate("2024-07-01"), parseDate("2024-07-10")],
  },
]

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root
      closeOnSelect={false}
      defaultFocusedValue={seeded}
      selectionMode="range"
      {...props}
    >
      <DatePicker.Control>
        <DatePicker.InputGroup label="Trip" />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.ViewControl>
                <DatePicker.ViewTrigger view="month">
                  <DatePicker.MonthText />
                </DatePicker.ViewTrigger>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
                <DatePicker.PresetsTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>
            <DatePicker.Presets>
              {presets.map((preset, index) => (
                <DatePicker.PresetTrigger key={index} value={preset.value}>
                  {preset.label}
                </DatePicker.PresetTrigger>
              ))}
            </DatePicker.Presets>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}

function Simple(props: Partial<DatePickerProps>) {
  return (
    <DatePicker
      closeOnSelect={false}
      defaultFocusedValue={seeded}
      label="Trip"
      presets={presets}
      selectionMode="range"
      {...props}
    />
  )
}

const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()
const presetsTrigger = () => page.getByRole("button", {name: /show presets/i})
const calendarTrigger = () => page.getByRole("button", {name: /show calendar/i})
const startInput = () => page.getByRole("textbox", {name: /start date/i})

const endInput = () => page.getByRole("textbox", {name: /end date/i})

describe("DatePicker - Presets", () => {
  test("the presets trigger reveals the preset list and flips its own label", async () => {
    await render(<Simple />)
    await openCalendar()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()

    await presetsTrigger().click()

    await expect.element(page.getByText("Next 7 days")).toBeVisible()
    await expect.element(calendarTrigger()).toBeVisible()

    await calendarTrigger().click()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
    await expect.element(presetsTrigger()).toBeVisible()
  })

  test("no presets trigger is rendered when no presets are given", async () => {
    await render(<Simple presets={undefined} />)
    await openCalendar()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect.element(presetsTrigger()).not.toBeInTheDocument()
  })

  test("a named preset commits a complete range and closes the panel", async () => {
    const onValueChange = vi.fn()
    await render(<Simple onValueChange={onValueChange} />)
    await openCalendar()

    await presetsTrigger().click()
    await page.getByText("Next 7 days").click()

    await expect.element(startInput()).not.toHaveValue("")
    await expect.element(endInput()).not.toHaveValue("")
    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
    expect(onValueChange).toHaveBeenCalled()
  })

  test("a preset given as explicit dates commits exactly those dates", async () => {
    await render(<Simple />)
    await openCalendar()

    await presetsTrigger().click()
    await page.getByText("Fixed span").click()

    await expect.element(startInput()).toHaveValue("07/01/2024")
    await expect.element(endInput()).toHaveValue("07/10/2024")
  })

  test("choosing a preset moves the calendar onto the preset's range", async () => {
    await render(<Simple />)
    await openCalendar()

    await presetsTrigger().click()
    await page.getByText("Fixed span").click()

    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .toHaveTextContent("July")
  })

  test("the paging and view triggers are inert while the preset panel is open", async () => {
    await render(<Composite />)
    await openCalendar()

    await presetsTrigger().click()

    await expect
      .element(page.getByRole("button", {name: /switch to next month/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to previous month/i}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .toBeDisabled()
  })

  test("reopening the calendar starts with the preset panel closed", async () => {
    await render(<Simple />)
    await openCalendar()
    await presetsTrigger().click()
    await expect.element(page.getByText("Next 7 days")).toBeVisible()

    await page.getByRole("button", {name: /close calendar/i}).click()
    await openCalendar()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
  })

  test("a preset trigger describes the range it will apply", async () => {
    await render(<Simple />)
    await openCalendar()
    await presetsTrigger().click()

    await expect
      .element(page.getByText("Fixed span"))
      .toHaveAttribute(
        "aria-label",
        "select Monday, July 1, 2024 to Wednesday, July 10, 2024",
      )
  })

  test("the preset label follows the picker's locale and time zone", async () => {
    await render(<Simple locale="de-DE" />)
    await openCalendar()
    await presetsTrigger().click()

    await expect
      .element(page.getByText("Fixed span"))
      .toHaveAttribute(
        "aria-label",
        "select Montag, 1. Juli 2024 to Mittwoch, 10. Juli 2024",
      )
  })

  test("a readOnly picker will not open the preset panel", async () => {
    await render(<Simple readOnly variant="inline" />)

    await presetsTrigger().click()

    await expect.element(page.getByText("Next 7 days")).not.toBeVisible()
  })
})
