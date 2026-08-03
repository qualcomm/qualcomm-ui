import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  DatePicker,
  type DatePickerProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

function Simple(props: Partial<DatePickerProps>) {
  return (
    <DatePicker
      defaultFocusedValue={parseDate("2024-06-15")}
      label="Dates"
      selectionMode="multiple"
      {...props}
    />
  )
}

// the field is the calendar trigger, so the label names it
function getField() {
  return page.getByRole("combobox", {name: "Dates"})
}

const tests: MultiComponentTestCase[] = [
  {
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("shows the placeholder when nothing is selected", async () => {
        await render(getComponent())
        await expect.element(page.getByText("Select dates")).toBeVisible()
      })
    },
  },
  {
    simple: () => (
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
      />
    ),
    testCase: (getComponent) => {
      test("renders one dismissible tag per selected date", async () => {
        await render(getComponent())
        await expect.element(page.getByText("06/10/2024")).toBeVisible()
        await expect.element(page.getByText("06/20/2024")).toBeVisible()
      })
    },
  },
  {
    simple: () => (
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
      />
    ),
    testCase: (getComponent) => {
      test("dismissing a tag removes that date", async () => {
        await render(getComponent())

        await page.getByRole("button", {name: /Remove 06\/10\/2024/i}).click()

        await expect
          .element(page.getByText("06/10/2024"))
          .not.toBeInTheDocument()
        await expect.element(page.getByText("06/20/2024")).toBeVisible()
      })
    },
  },
  {
    simple: () => (
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        maxSelectedDates={2}
      />
    ),
    testCase: (getComponent) => {
      test("disables only unselected days once maxSelectedDates is reached", async () => {
        await render(getComponent())
        await getField().click()

        await expect
          .element(page.getByRole("gridcell", {name: /June 25, 2024/}))
          .toHaveAttribute("aria-disabled", "true")

        // already-selected dates stay enabled so they can be deselected
        await expect
          .element(page.getByRole("gridcell", {name: /June 10, 2024/}))
          .toHaveAttribute("aria-disabled", "false")
      })
    },
  },
]

describe("DatePicker - Multiple", () => {
  runTests(tests)

  test("clicking a selected day removes it from the selection", async () => {
    await render(
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
      />,
    )
    await getField().click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    await expect.element(page.getByText("06/10/2024")).not.toBeInTheDocument()
    await expect.element(page.getByText("06/20/2024")).toBeVisible()
  })

  test("Enter toggles the focused day without closing the calendar", async () => {
    await render(<Simple />)
    await getField().click()

    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("06/15/2024")).toBeVisible()

    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("06/15/2024")).not.toBeInTheDocument()
    await expect.element(page.getByRole("grid")).toBeVisible()
  })

  test("selections are kept in chronological order regardless of pick order", async () => {
    const onValueChange = vi.fn()
    await render(<Simple onValueChange={onValueChange} />)
    await getField().click()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()

    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        valueAsString: ["06/10/2024", "06/20/2024"],
      }),
    )
  })

  test("maxSelectedDates rejects a further selection", async () => {
    const onValueChange = vi.fn()
    await render(
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        maxSelectedDates={2}
        onValueChange={onValueChange}
      />,
    )
    await getField().click()

    const cell = page.getByLabelText(/June 25, 2024/).element() as HTMLElement
    cell.click()

    expect(onValueChange).not.toHaveBeenCalled()
    await expect.element(page.getByText("06/25/2024")).not.toBeInTheDocument()
  })

  test("a date freed up by deselection can be re-spent under maxSelectedDates", async () => {
    await render(
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        maxSelectedDates={2}
      />,
    )
    await getField().click()

    await page.getByRole("gridcell", {name: /June 10, 2024/}).click()
    await page.getByRole("gridcell", {name: /June 25, 2024/}).click()

    await expect.element(page.getByText("06/20/2024")).toBeVisible()
    await expect.element(page.getByText("06/25/2024")).toBeVisible()
    await expect.element(page.getByText("06/10/2024")).not.toBeInTheDocument()
  })

  test("the multiple field has no text input, so the label names the field", async () => {
    await render(<Simple />)

    await expect.element(getField()).toBeVisible()
    await expect.element(page.getByRole("textbox")).not.toBeInTheDocument()
  })

  test("a disabled picker renders its tags as disabled", async () => {
    await render(<Simple defaultValue={[parseDate("2024-06-10")]} disabled />)

    await expect
      .element(page.getByRole("button", {name: /Remove 06\/10\/2024/i}))
      .toBeDisabled()
  })

  test("the inline headline collapses more than two dates into a summary", async () => {
    await render(
      <Simple
        defaultValue={[
          parseDate("2024-06-10"),
          parseDate("2024-06-20"),
          parseDate("2024-06-25"),
        ]}
        variant="inline"
      />,
    )

    await expect.element(page.getByText("Jun 10, 2024 +2 more")).toBeVisible()
  })

  test("the inline headline lists two dates in full", async () => {
    await render(
      <Simple
        defaultValue={[parseDate("2024-06-10"), parseDate("2024-06-20")]}
        variant="inline"
      />,
    )

    await expect
      .element(page.getByText("Jun 10, 2024, Jun 20, 2024"))
      .toBeVisible()
  })

  test("headlineValueProps overrides the summary suffix", async () => {
    await render(
      <Simple
        defaultValue={[
          parseDate("2024-06-10"),
          parseDate("2024-06-20"),
          parseDate("2024-06-25"),
        ]}
        headlineValueProps={{moreLabel: (count) => `and ${count} others`}}
        variant="inline"
      />,
    )

    await expect
      .element(page.getByText("Jun 10, 2024 and 2 others"))
      .toBeVisible()
  })

  describe("the field acts as the calendar trigger", () => {
    test("clicking the field toggles the calendar", async () => {
      await render(<Simple />)

      await getField().click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await getField().click()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("clicking the placeholder opens the calendar", async () => {
      await render(<Simple />)

      await page.getByText("Select dates").click()

      await expect.element(page.getByRole("grid")).toBeVisible()
    })

    test("clicking a tag does not open the calendar", async () => {
      await render(<Simple defaultValue={[parseDate("2024-06-10")]} />)

      await page.getByText("06/10/2024").click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("dismissing a tag does not open the calendar", async () => {
      await render(<Simple defaultValue={[parseDate("2024-06-10")]} />)

      await page.getByRole("button", {name: /Remove 06\/10\/2024/i}).click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("clearing the value does not open the calendar", async () => {
      await render(<Simple defaultValue={[parseDate("2024-06-10")]} />)

      await page.getByRole("button", {name: /clear/i}).click()

      await expect.element(page.getByText("Select dates")).toBeVisible()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test.for(["{Enter}", " "])("%s opens the calendar", async (key) => {
      await render(<Simple />)

      // open then close leaves the field focused and closed
      await getField().click()
      await getField().click()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      await expect.element(getField()).toHaveFocus()

      await userEvent.keyboard(key)
      await expect.element(page.getByRole("grid")).toBeVisible()
    })

    test("ArrowDown opens the calendar", async () => {
      await render(<Simple />)

      await getField().click()
      await getField().click()
      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()

      await userEvent.keyboard("{ArrowDown}")
      await expect.element(page.getByRole("grid")).toBeVisible()
    })

    test("escape closes the calendar and restores focus to the field", async () => {
      await render(<Simple />)

      await getField().click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await userEvent.keyboard("{Escape}")

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      await expect.element(getField()).toHaveFocus()
    })

    test("a disabled field does not open the calendar", async () => {
      await render(<Simple disabled />)

      await expect.element(getField()).toHaveAttribute("aria-disabled", "true")

      const field = getField().element() as HTMLElement
      field.click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("a readonly field does not open the calendar", async () => {
      await render(<Simple readOnly />)

      await expect.element(getField()).toHaveAttribute("aria-readonly", "true")

      await getField().click()

      await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    })

    test("switching selectionMode at runtime hands the trigger over cleanly", async () => {
      function ModeSwitcher() {
        const [mode, setMode] =
          useState<DatePickerProps["selectionMode"]>("multiple")
        return (
          <>
            <DatePicker
              defaultFocusedValue={parseDate("2024-06-15")}
              label="Dates"
              selectionMode={mode}
            />
            <button
              onClick={() =>
                setMode(mode === "multiple" ? "single" : "multiple")
              }
              type="button"
            >
              Swap mode
            </button>
          </>
        )
      }

      await render(<ModeSwitcher />)
      await expect.element(getField()).toBeVisible()

      await page.getByRole("button", {name: "Swap mode"}).click()

      const trigger = page.getByRole("button", {name: /open calendar/i})
      await expect.element(trigger).toBeVisible()
      await trigger.click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await userEvent.keyboard("{Escape}")
      await expect.element(trigger).toHaveFocus()

      await page.getByRole("button", {name: "Swap mode"}).click()

      await expect.element(getField()).toBeVisible()
      await getField().click()
      await expect.element(page.getByRole("grid")).toBeVisible()

      await userEvent.keyboard("{Escape}")
      await expect.element(getField()).toHaveFocus()
    })

    test("switching to range restores the group role on the field", async () => {
      function RangeSwitcher() {
        const [mode, setMode] =
          useState<DatePickerProps["selectionMode"]>("multiple")
        return (
          <>
            <DatePicker
              defaultFocusedValue={parseDate("2024-06-15")}
              label="Dates"
              selectionMode={mode}
            />
            <button
              onClick={() =>
                setMode(mode === "multiple" ? "range" : "multiple")
              }
              type="button"
            >
              Swap mode
            </button>
          </>
        )
      }

      await render(<RangeSwitcher />)
      await expect.element(getField()).toBeVisible()

      await page.getByRole("button", {name: "Swap mode"}).click()

      const group = page.getByRole("group", {name: "Dates"})
      await expect.element(group).toBeVisible()
      await expect.element(group).toHaveAttribute("dir", "ltr")

      await page.getByRole("button", {name: "Swap mode"}).click()

      await expect.element(getField()).toBeVisible()
      await expect.element(getField()).toHaveAttribute("dir", "ltr")
    })

    test("clicking the label focuses the field", async () => {
      await render(<Simple />)

      await page.getByText("Dates", {exact: true}).click()

      await expect.element(getField()).toHaveFocus()
    })

    test("the calendar icon is not a separate tab stop", async () => {
      await render(<Simple />)

      await expect
        .element(page.getByRole("button", {name: /open calendar/i}))
        .not.toBeInTheDocument()
    })
  })
})
