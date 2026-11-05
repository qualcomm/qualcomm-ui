import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const hint = "Arrival must be after this date"
const errorText = "Pick a date in the future"

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root {...props}>
      <DatePicker.Control>
        <DatePicker.InputGroup label="Departure date" />
      </DatePicker.Control>
      <DatePicker.Hint>{hint}</DatePicker.Hint>
      <DatePicker.ErrorText>{errorText}</DatePicker.ErrorText>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}

function Simple(props: Partial<DatePickerProps>) {
  return (
    <DatePicker
      errorText={errorText}
      hint={hint}
      label="Departure date"
      {...props}
    />
  )
}

const input = () => page.getByRole("textbox")

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("a valid picker shows the hint and hides the error text", async () => {
        await render(getComponent())

        await expect.element(page.getByText(hint)).toBeVisible()
        await expect.element(page.getByText(errorText)).not.toBeVisible()
        await expect
          .element(input())
          .not.toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite: () => <Composite invalid />,
    simple: () => <Simple invalid />,
    testCase: (getComponent) => {
      test("an invalid picker swaps the hint for the error text", async () => {
        await render(getComponent())

        await expect.element(page.getByText(errorText)).toBeVisible()
        await expect.element(page.getByText(hint)).not.toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite invalid />,
    simple: () => <Simple invalid />,
    testCase: (getComponent) => {
      test("an invalid picker marks the input and points it at the error text", async () => {
        await render(getComponent())

        await expect.element(input()).toHaveAttribute("aria-invalid", "true")

        const describedBy = input().element().getAttribute("aria-describedby")
        const errorId = page.getByText(errorText).element().id
        expect(describedBy?.split(" ")).toContain(errorId)
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the hint is associated with the input", async () => {
        await render(getComponent())

        const describedBy = input().element().getAttribute("aria-describedby")
        const hintId = page.getByText(hint).element().id
        expect(describedBy?.split(" ")).toContain(hintId)
      })
    },
  },
  {
    composite: () => <Composite invalid />,
    simple: () => <Simple invalid />,
    testCase: (getComponent) => {
      test("the error indicator only appears while invalid", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText("Error")).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the error indicator is absent while valid", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText("Error")).not.toBeVisible()
      })
    },
  },
]

describe("DatePicker - Validation", () => {
  runTests(tests)

  test("the label is wired to the single input", async () => {
    await render(<DatePicker label="Departure date" />)

    await expect
      .element(page.getByLabelText("Departure date"))
      .toHaveAttribute("data-date-picker-part", "input")
  })

  test("a range picker groups its two inputs under the shared label", async () => {
    await render(<DatePicker label="Trip" selectionMode="range" />)

    const group = page.getByRole("group", {name: "Trip"})
    await expect.element(group).toBeVisible()
    expect(group.element().querySelectorAll("input")).toHaveLength(2)
  })

  test("an invalid range picker marks both of its inputs", async () => {
    await render(<DatePicker invalid label="Trip" selectionMode="range" />)

    await expect
      .element(page.getByRole("textbox", {name: /start date/i}))
      .toHaveAttribute("aria-invalid", "true")
    await expect
      .element(page.getByRole("textbox", {name: /end date/i}))
      .toHaveAttribute("aria-invalid", "true")
  })

  test("multiple mode carries the invalid state on the field, since it has no input to mark", async () => {
    await render(
      <DatePicker
        errorText={errorText}
        invalid
        label="Dates"
        selectionMode="multiple"
      />,
    )

    const field = page.getByRole("combobox", {name: "Dates"})
    await expect.element(field).toHaveAttribute("aria-invalid", "true")

    const describedBy = field.element().getAttribute("aria-describedby")
    const errorId = page.getByText(errorText).element().id
    expect(describedBy?.split(" ")).toContain(errorId)
  })
})
