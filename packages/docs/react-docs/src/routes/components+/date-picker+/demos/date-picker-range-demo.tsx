import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerRangeDemo(): ReactElement {
  return (
    // preview
    <DatePicker className="w-80" label="Trip dates" selectionMode="range" />
    // preview
  )
}
