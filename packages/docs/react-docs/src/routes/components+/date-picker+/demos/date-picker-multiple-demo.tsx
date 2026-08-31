import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerMultipleDemo(): ReactElement {
  return (
    // preview
    <DatePicker
      className="w-80"
      label="Maintenance days"
      maxSelectedDates={4}
      selectionMode="multiple"
    />
    // preview
  )
}
