import type {ReactElement} from "react"

import {DatePicker, isWeekend} from "@qualcomm-ui/react/date-picker"

export function DatePickerUnavailableDemo(): ReactElement {
  return (
    // preview
    <DatePicker
      className="w-64"
      hint="Weekends are not available"
      isDateUnavailable={isWeekend}
      label="Delivery date"
    />
    // preview
  )
}
