import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerOpenOnClickDemo(): ReactElement {
  return (
    // preview
    <DatePicker className="w-64" label="Departure date" openOnClick />
    // preview
  )
}
