import type {ReactNode} from "react"

import {afterEach, describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import type {DatePickerApi} from "@qualcomm-ui/core/date-picker"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerRootProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

const seeded = parseDate("2024-06-15")

/**
 * The imperative api is only reachable through the context render prop, so these
 * cases cover the methods that have no direct UI affordance.
 */
function WithApi({
  children,
  inContent,
  ...props
}: Omit<Partial<DatePickerRootProps>, "children"> & {
  children?: (api: DatePickerApi) => ReactNode
  /**
   * Rendered inside `Content`. A button placed outside it counts as an outside
   * interaction and would dismiss the popover before its own `onClick` runs.
   */
  inContent?: (api: DatePickerApi) => ReactNode
}) {
  return (
    <DatePicker.Root defaultFocusedValue={seeded} {...props}>
      {/* above the control so the downward popover cannot cover the buttons */}
      {children ? <DatePicker.Context>{children}</DatePicker.Context> : null}
      <DatePicker.Control>
        <DatePicker.InputGroup label="Departure date" />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>
            {inContent ? (
              <DatePicker.Context>{inContent}</DatePicker.Context>
            ) : null}
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}

const input = () => page.getByRole("textbox")
const grid = () => page.getByRole("grid")
const act = (name: string) => page.getByRole("button", {name}).click()

describe("DatePicker - API", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test("selectToday uses the configured time zone", async () => {
    vi.setSystemTime(new Date("2024-06-01T00:30:00Z"))
    await render(
      <WithApi timeZone="America/Los_Angeles">
        {(api) => <button onClick={() => api.selectToday()}>Today</button>}
      </WithApi>,
    )

    await act("Today")

    await expect.element(input()).toHaveValue("05/31/2024")
  })

  test("selectToday clamps to max when today is out of range", async () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"))
    await render(
      <WithApi max={parseDate("2020-01-31")}>
        {(api) => <button onClick={() => api.selectToday()}>Today</button>}
      </WithApi>,
    )

    await act("Today")

    await expect.element(input()).toHaveValue("01/31/2020")
  })

  test("setValue constrains the given date to min and max", async () => {
    await render(
      <WithApi max={parseDate("2024-06-20")} min={parseDate("2024-06-10")}>
        {(api) => (
          <button onClick={() => api.setValue([parseDate("2024-06-25")])}>
            Set
          </button>
        )}
      </WithApi>,
    )

    await act("Set")

    await expect.element(input()).toHaveValue("06/20/2024")
  })

  test("setValue orders a reversed range instead of storing it as given", async () => {
    const onValueChange = vi.fn()
    await render(
      <WithApi onValueChange={onValueChange} selectionMode="range">
        {(api) => (
          <button
            onClick={() =>
              api.setValue([parseDate("2024-06-20"), parseDate("2024-06-10")])
            }
          >
            Set
          </button>
        )}
      </WithApi>,
    )

    await act("Set")

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({
        valueAsString: ["06/10/2024", "06/20/2024"],
      }),
    )
  })

  test("setValue keeps only the first date in single mode", async () => {
    const onValueChange = vi.fn()
    await render(
      <WithApi onValueChange={onValueChange}>
        {(api) => (
          <button
            onClick={() =>
              api.setValue([parseDate("2024-06-10"), parseDate("2024-06-20")])
            }
          >
            Set
          </button>
        )}
      </WithApi>,
    )

    await act("Set")

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({valueAsString: ["06/10/2024"]}),
    )
  })

  test("clearValue empties the selection", async () => {
    await render(
      <WithApi defaultValue={[seeded]}>
        {(api) => <button onClick={() => api.clearValue()}>Wipe</button>}
      </WithApi>,
    )
    await expect.element(input()).toHaveValue("06/15/2024")

    await act("Wipe")

    await expect.element(input()).toHaveValue("")
  })

  test("setOpen drives the calendar without a trigger click", async () => {
    await render(
      <WithApi
        inContent={(api) => (
          <button onClick={() => api.setOpen(false)}>Hide</button>
        )}
      >
        {(api) => <button onClick={() => api.setOpen(true)}>Show</button>}
      </WithApi>,
    )

    await act("Show")
    await expect.element(grid()).toBeVisible()

    await act("Hide")
    await expect.element(grid()).not.toBeInTheDocument()
  })

  test("setFocusedValue moves the visible month", async () => {
    await render(
      <DatePicker.Root defaultFocusedValue={seeded} inline>
        <DatePicker.Context>
          {(api) => (
            <button
              onClick={() => api.setFocusedValue(parseDate("2024-09-05"))}
            >
              Jump
            </button>
          )}
        </DatePicker.Context>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Table>
              <DatePicker.DayGridHeader />
              <DatePicker.DayGrid />
            </DatePicker.Table>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>,
    )
    await expect
      .element(page.getByRole("gridcell", {name: /June 15, 2024/}))
      .toBeVisible()

    await act("Jump")

    await expect
      .element(page.getByRole("gridcell", {name: /September 5, 2024/}))
      .toBeVisible()
    await expect
      .element(page.getByLabelText(/September 5, 2024/))
      .toHaveAttribute("data-focus")
  })

  test("toggleValue adds then removes a date in multiple mode", async () => {
    const onValueChange = vi.fn()
    await render(
      <WithApi onValueChange={onValueChange} selectionMode="multiple">
        {(api) => (
          <button onClick={() => api.toggleValue(parseDate("2024-06-20"))}>
            Toggle
          </button>
        )}
      </WithApi>,
    )

    await act("Toggle")
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({valueAsString: ["06/20/2024"]}),
    )

    await act("Toggle")
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({valueAsString: []}),
    )
  })

  test("toggleValue is ignored while readOnly", async () => {
    const onValueChange = vi.fn()
    await render(
      <WithApi onValueChange={onValueChange} readOnly selectionMode="multiple">
        {(api) => (
          <button onClick={() => api.toggleValue(parseDate("2024-06-20"))}>
            Toggle
          </button>
        )}
      </WithApi>,
    )

    await act("Toggle")

    expect(onValueChange).not.toHaveBeenCalled()
  })

  test("setTime attaches a time to the selected date and keeps it on reselection", async () => {
    let latest: DatePickerApi | undefined
    await render(
      <WithApi closeOnSelect={false} defaultValue={[seeded]}>
        {(api) => {
          latest = api
          return (
            <button onClick={() => api.setTime({hour: 9, minute: 30})}>
              Set time
            </button>
          )
        }}
      </WithApi>,
    )

    await act("Set time")
    await expect.element(input()).toHaveValue("06/15/2024")
    expect(latest?.value[0]).toMatchObject({hour: 9, minute: 30})

    await act("Change date")
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(input()).toHaveValue("06/20/2024")
    expect(latest?.value[0]).toMatchObject({day: 20, hour: 9, minute: 30})
  })

  test("cancel reverts to the value the calendar opened with", async () => {
    await render(
      <WithApi
        closeOnSelect={false}
        defaultValue={[parseDate("2024-06-10")]}
        inContent={(api) => (
          <button onClick={() => api.cancel()}>Discard</button>
        )}
      />,
    )

    await act("Change date")
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(input()).toHaveValue("06/20/2024")

    await act("Discard")

    await expect.element(input()).toHaveValue("06/10/2024")
  })

  test("getRangePresetValue resolves a named preset to a pair of dates", async () => {
    vi.setSystemTime(new Date("2024-06-20T12:00:00Z"))
    let resolved: string[] = []
    await render(
      <WithApi selectionMode="range" timeZone="UTC">
        {(api) => (
          <button
            onClick={() => {
              resolved = api
                .getRangePresetValue("thisMonth")
                .map((date) => date.toString())
            }}
          >
            Resolve
          </button>
        )}
      </WithApi>,
    )

    await act("Resolve")

    expect(resolved).toEqual(["2024-06-01", "2024-06-20"])
  })
})
