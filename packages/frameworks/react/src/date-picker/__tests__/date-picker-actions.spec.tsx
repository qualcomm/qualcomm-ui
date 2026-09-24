import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const seeded = parseDate("2024-06-15")

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root
      closeOnSelect={false}
      defaultFocusedValue={seeded}
      {...props}
    >
      <DatePicker.Control>
        <DatePicker.InputGroup label="Departure date" />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>
            <DatePicker.Actions>
              <DatePicker.CancelTrigger />
              <DatePicker.OkTrigger />
            </DatePicker.Actions>
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
      label="Departure date"
      {...props}
    />
  )
}

const grid = () => page.getByRole("grid")
const openCalendar = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i}).click()
const okTrigger = () => page.getByRole("button", {name: "OK"})
const cancelTrigger = () => page.getByRole("button", {name: "Cancel"})

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("closeOnSelect=false keeps the calendar open after a selection", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

        await expect.element(grid()).toBeVisible()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("OK closes the calendar and keeps the selection", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await okTrigger().click()

        await expect.element(grid()).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[parseDate("2024-06-10")]} {...props} />
    ),
    simple: (props) => (
      <Simple defaultValue={[parseDate("2024-06-10")]} {...props} />
    ),
    testCase: (getComponent) => {
      test("Cancel discards the pending selection and restores the value the calendar opened with", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")

        await cancelTrigger().click()

        await expect.element(grid()).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/10/2024")
        expect(onValueChange).toHaveBeenLastCalledWith(
          expect.objectContaining({valueAsString: ["06/10/2024"]}),
        )
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Cancel with no prior value leaves the field empty", async () => {
        await render(getComponent())
        await openCalendar()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await cancelTrigger().click()

        await expect.element(page.getByRole("textbox")).toHaveValue("")
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[parseDate("2024-06-10")]} {...props} />
    ),
    simple: (props) => (
      <Simple defaultValue={[parseDate("2024-06-10")]} {...props} />
    ),
    testCase: (getComponent) => {
      test("a reopened calendar takes a fresh snapshot, so Cancel restores the previously confirmed value", async () => {
        await render(getComponent())

        await openCalendar()
        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
        await okTrigger().click()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")

        await openCalendar()
        await page.getByRole("gridcell", {name: /June 25, 2024/}).click()
        await cancelTrigger().click()

        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
]

describe("DatePicker - Actions", () => {
  runTests(tests)

  test("the actions footer is omitted while closeOnSelect is left at its default", async () => {
    await render(
      <DatePicker defaultFocusedValue={seeded} label="Departure date" />,
    )
    await openCalendar()

    await expect.element(grid()).toBeVisible()
    await expect.element(okTrigger()).not.toBeInTheDocument()
    await expect.element(cancelTrigger()).not.toBeInTheDocument()
  })

  test("multiple mode renders the actions footer so the popover survives each toggle", async () => {
    await render(
      <DatePicker
        defaultFocusedValue={seeded}
        label="Dates"
        selectionMode="multiple"
      />,
    )
    // in multiple mode the field itself is the trigger
    await page.getByRole("combobox", {name: "Dates"}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(grid()).toBeVisible()
    await okTrigger().click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByText("06/10/2024")).toBeVisible()
    await expect.element(page.getByText("06/20/2024")).toBeVisible()
  })

  test("Escape behaves like Cancel, discarding the pending selection", async () => {
    await render(<Simple defaultValue={[parseDate("2024-06-10")]} />)
    await openCalendar()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await userEvent.keyboard("{Escape}")

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/10/2024")
  })
})
