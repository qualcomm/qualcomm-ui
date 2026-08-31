import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root {...props}>
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
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}

function Simple(props: Partial<DatePickerProps>) {
  return <DatePicker label="Departure date" {...props} />
}

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: (props) => <Composite {...props} />,
    simple: (props) => <Simple {...props} />,
    testCase: (getComponent) => {
      test("typing a valid date and pressing Enter commits it", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        const input = page.getByRole("textbox")
        await input.fill("06/20/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("06/20/2024")
        expect(onValueChange).toHaveBeenCalledWith(
          expect.objectContaining({valueAsString: ["06/20/2024"]}),
        )
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    simple: (props) => (
      <Simple defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    testCase: (getComponent) => {
      test("an invalid date restores the last committed value", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        const input = page.getByRole("textbox")
        await input.fill("13/45/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("06/15/2024")
        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    simple: (props) => (
      <Simple defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    testCase: (getComponent) => {
      test("custom parse and format functions drive the input round trip", async () => {
        const format = vi.fn((date: DateValue) =>
          date.toString().replaceAll("-", "/"),
        )
        const parse = vi.fn((value: string) =>
          value === "2024/06/20" ? parseDate("2024-06-20") : undefined,
        )
        await render(
          getComponent({
            format,
            locale: "en-GB",
            parse,
            timeZone: "Europe/Paris",
          }),
        )

        const input = page.getByRole("textbox")
        await expect.element(input).toHaveValue("2024/06/15")

        await input.fill("2024/06/20")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("2024/06/20")
        expect(parse).toHaveBeenCalledWith("2024/06/20", {
          locale: "en-GB",
          timeZone: "Europe/Paris",
        })
        expect(format).toHaveBeenCalledWith(
          expect.objectContaining({day: 20, month: 6, year: 2024}),
          {locale: "en-GB", timeZone: "Europe/Paris"},
        )
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    simple: (props) => (
      <Simple defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    testCase: (getComponent) => {
      test("pressing Enter invokes a custom parse function exactly once", async () => {
        const parse = vi.fn((value: string) =>
          value === "06/20/2024" ? parseDate("2024-06-20") : undefined,
        )
        await render(getComponent({parse}))

        const input = page.getByRole("textbox")
        await input.fill("06/20/2024")
        parse.mockClear()

        await userEvent.keyboard("{Enter}")

        expect(parse).toHaveBeenCalledTimes(1)
      })
    },
  },
  {
    composite: (props) => (
      <Composite defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    simple: (props) => (
      <Simple defaultValue={[parseDate("2024-06-15")]} {...props} />
    ),
    testCase: (getComponent) => {
      test("clearing the input clears the committed value", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))

        const input = page.getByRole("textbox")
        await expect.element(input).toHaveValue("06/15/2024")

        await input.fill("")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("")
        expect(onValueChange).toHaveBeenCalledWith(
          expect.objectContaining({value: [], valueAsString: []}),
        )
      })
    },
  },
  {
    composite: () => (
      <Composite max={parseDate("2024-06-20")} min={parseDate("2024-06-10")} />
    ),
    simple: () => (
      <Simple max={parseDate("2024-06-20")} min={parseDate("2024-06-10")} />
    ),
    testCase: (getComponent) => {
      test("constrains an above-max date to the max on blur", async () => {
        await render(getComponent())

        const input = page.getByRole("textbox")
        await input.fill("06/25/2024")
        await userEvent.keyboard("{Tab}")

        await expect.element(input).toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => (
      <Composite max={parseDate("2024-06-20")} min={parseDate("2024-06-10")} />
    ),
    simple: () => (
      <Simple max={parseDate("2024-06-20")} min={parseDate("2024-06-10")} />
    ),
    testCase: (getComponent) => {
      test("constrains a below-min date to the min on blur", async () => {
        await render(getComponent())

        const input = page.getByRole("textbox")
        await input.fill("06/05/2024")
        await userEvent.keyboard("{Tab}")

        await expect.element(input).toHaveValue("06/10/2024")
      })
    },
  },
]

describe("DatePicker - Input", () => {
  runTests(tests)
})
