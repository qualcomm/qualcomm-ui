import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerActionsDemo(): ReactElement {
  return (
    // preview
    <DatePicker className="w-64" closeOnSelect={false} label="Departure date" />
    // preview
  )
}
