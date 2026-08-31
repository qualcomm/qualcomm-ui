import {type ReactElement, useState} from "react"

import type {DateValue} from "@qualcomm-ui/core/date-picker"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerCompositeDemo(): ReactElement {
  const [value, setValue] = useState<(DateValue | null)[]>([])

  return (
    // preview
    <DatePicker.Root
      className="w-64"
      invalid={!value.length}
      onValueChange={(details) => setValue(details.value)}
      required
      value={value}
    >
      <DatePicker.Control>
        <DatePicker.InputGroup label="Departure date" />
      </DatePicker.Control>
      <DatePicker.Hint>Choose a date in mm/dd/yyyy format</DatePicker.Hint>
      <DatePicker.ErrorText>A departure date is required</DatePicker.ErrorText>

      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.ViewControl>
                <DatePicker.ViewTrigger view="month">
                  <DatePicker.MonthText />
                </DatePicker.ViewTrigger>
                <DatePicker.ViewTrigger view="year">
                  <DatePicker.YearText />
                </DatePicker.ViewTrigger>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.DayGridHeader />
                <DatePicker.DayGrid />
              </DatePicker.Table>
            </DatePicker.View>

            <DatePicker.View view="month">
              <DatePicker.ViewControl>
                <DatePicker.ViewTrigger disabled view="month">
                  <DatePicker.MonthText />
                </DatePicker.ViewTrigger>
                <DatePicker.ViewTrigger disabled view="year">
                  <DatePicker.YearText />
                </DatePicker.ViewTrigger>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
                <DatePicker.ViewCloseTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.MonthGrid />
              </DatePicker.Table>
            </DatePicker.View>

            <DatePicker.View view="year">
              <DatePicker.ViewControl>
                <DatePicker.ViewTrigger disabled view="month">
                  <DatePicker.MonthText />
                </DatePicker.ViewTrigger>
                <DatePicker.ViewTrigger disabled view="year">
                  <DatePicker.YearText />
                </DatePicker.ViewTrigger>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
                <DatePicker.ViewCloseTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.YearGrid />
              </DatePicker.Table>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
    // preview
  )
}
