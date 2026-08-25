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
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
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
      defaultFocusedValue={seeded}
      label="Trip"
      selectionMode="range"
      {...props}
    />
  )
}

const startInput = () => page.getByRole("textbox", {name: /start date/i})
const endInput = () => page.getByRole("textbox", {name: /end date/i})

/**
 * Cell state (`data-*`) and focus live on the trigger inside the `gridcell`,
 * not on the cell itself.
 */
const dayTrigger = (day: string) => page.getByLabelText(day)

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("the range start keeps the calendar open and the end closes it", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()

        await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

        await expect.element(page.getByRole("grid")).toBeVisible()
        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("")

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("typing the end date first leaves the start slot empty, then accepts a start date", async () => {
        await render(getComponent())

        await endInput().fill("06/20/2024")
        await userEvent.keyboard("{Enter}")

        // the end date must stay in slot 1 rather than collapsing into slot 0
        await expect.element(startInput()).toHaveValue("")
        await expect.element(endInput()).toHaveValue("06/20/2024")

        await startInput().fill("06/10/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("normalizes a reversed range entered via input", async () => {
        await render(getComponent())

        await startInput().fill("06/20/2024")
        await userEvent.keyboard("{Enter}")
        await endInput().fill("06/10/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: (props) => (
      <Composite
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        {...props}
      />
    ),
    simple: (props) => (
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        {...props}
      />
    ),
    testCase: (getComponent) => {
      test("clearing only the start input leaves the end date intact", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")

        await startInput().fill("")
        await userEvent.keyboard("{Enter}")

        await expect.element(startInput()).toHaveValue("")
        await expect.element(endInput()).toHaveValue("06/20/2024")
        // the cleared slot becomes a positional hole, not a collapsed array
        expect(onValueChange).toHaveBeenCalledWith(
          expect.objectContaining({valueAsString: ["", "06/20/2024"]}),
        )
      })
    },
  },
  {
    composite: () => (
      <Composite
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
      />
    ),
    simple: () => (
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
      />
    ),
    testCase: (getComponent) => {
      test("reverts an unparsable start date when tabbing to the end input, leaving the end intact", async () => {
        await render(getComponent())

        await startInput().fill("64564")
        await userEvent.keyboard("{Tab}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
        await expect.element(endInput()).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("reverts trailing garbage typed into the start input after it committed", async () => {
        await render(getComponent())

        await startInput().fill("06/10/2024")
        await userEvent.keyboard("{Enter}")
        await expect.element(startInput()).toHaveValue("06/10/2024")

        await userEvent.keyboard("99")
        await userEvent.keyboard("{Tab}")

        await expect.element(startInput()).toHaveValue("06/10/2024")
      })
    },
  },
]

describe("DatePicker - Range", () => {
  runTests(tests)

  test("previews the range band while hovering after picking a start date", async () => {
    await render(<Simple />)
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await dayTrigger("June 20, 2024").hover()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 10, 2024"))
      .toHaveAttribute("data-hover-range-start")
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-in-hover-range")
    await expect
      .element(dayTrigger("June 20, 2024"))
      .toHaveAttribute("data-hover-range-end")

    // outside the previewed span
    await expect
      .element(dayTrigger("June 25, 2024"))
      .not.toHaveAttribute("data-in-hover-range")
  })

  test("marks the committed range band once both endpoints are selected", async () => {
    // closeOnSelect would hide the calendar the moment the range completes
    await render(<Simple closeOnSelect={false} />)
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 10, 2024"))
      .toHaveAttribute("data-range-start")
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-in-range")
    await expect
      .element(dayTrigger("June 20, 2024"))
      .toHaveAttribute("data-range-end")

    await expect
      .element(dayTrigger("June 25, 2024"))
      .not.toHaveAttribute("data-in-range")
  })

  test("leaving the grid clears the previewed band", async () => {
    await render(<Simple />)
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await dayTrigger("June 20, 2024").hover()
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-in-hover-range")

    await page.getByRole("button", {name: /switch to next month/i}).hover()

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 15, 2024"))
      .not.toHaveAttribute("data-in-hover-range")
  })

  test("keyboard navigation previews the band the same way hovering does", async () => {
    await render(<Simple />)
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowRight}{ArrowRight}")

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect
      .element(dayTrigger("June 17, 2024"))
      .toHaveAttribute("data-in-hover-range")
    await expect
      .element(dayTrigger("June 18, 2024"))
      .toHaveAttribute("data-hover-range-end")
  })

  test("a third click starts a new range from the clicked day", async () => {
    await render(<Simple closeOnSelect={false} />)
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")

    await page.getByRole("gridcell", {name: /June 25, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/25/2024")
    await expect.element(endInput()).toHaveValue("")
  })

  test("a range half-entered by typing resumes at the end slot in the calendar", async () => {
    await render(<Simple />)

    await startInput().fill("06/10/2024")
    await userEvent.keyboard("{Enter}")

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("a range left with only an end date resumes at the start slot in the calendar", async () => {
    await render(
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
      />,
    )

    await startInput().fill("")
    await userEvent.keyboard("{Enter}")
    await expect.element(startInput()).toHaveValue("")

    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()
    await page.getByRole("gridcell", {name: /June 5, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/05/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("the second calendar pick completes the range regardless of click order", async () => {
    await render(<Simple />)
    await page.getByRole("button", {name: /(?:choose|change) date/i}).click()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("06/20/2024")
  })

  test("clearing only the end input leaves the start date intact", async () => {
    const onValueChange = vi.fn()
    await render(
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        onValueChange={onValueChange}
      />,
    )

    await endInput().fill("")
    await userEvent.keyboard("{Enter}")

    await expect.element(startInput()).toHaveValue("06/10/2024")
    await expect.element(endInput()).toHaveValue("")
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({valueAsString: ["06/10/2024"]}),
    )
  })

  test("the range headline shows placeholders until both endpoints are set", async () => {
    await render(<Simple variant="inline" />)

    await expect.element(page.getByText("Start - End")).toBeVisible()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(page.getByText("Jun 10, 2024 - End")).toBeVisible()
  })
})
