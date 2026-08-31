import type {ReactElement} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react/button"
import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerCustomTriggerDemo(): ReactElement {
  return (
    // preview
    <DatePicker.Root closeOnSelect={false}>
      <DatePicker.Context>
        {(api) => (
          <DatePicker.Control className="flex gap-2">
            <DatePicker.Trigger render={<Button variant="outline" />}>
              {api.valueAsString[0] || "Pick a date"}
            </DatePicker.Trigger>
            {api.value.length ? (
              <Button
                onClick={() => api.clearValue()}
                type="button"
                variant="ghost"
              >
                Clear
              </Button>
            ) : null}
          </DatePicker.Control>
        )}
      </DatePicker.Context>

      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.Headline>
              <DatePicker.HeadlineLabel />
              <DatePicker.HeadlineValue />
            </DatePicker.Headline>

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

            <DatePicker.Actions>
              <DatePicker.CancelTrigger />
              <DatePicker.OkTrigger />
            </DatePicker.Actions>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
    // preview
  )
}
