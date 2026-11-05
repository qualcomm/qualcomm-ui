import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerHintDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <DatePicker
        className="w-64"
        hint="Choose a date in mm/dd/yyyy format"
        label="Departure date"
      />
      <DatePicker
        className="w-64"
        errorText="A departure date is required"
        hint="Choose a date in mm/dd/yyyy format"
        invalid
        label="Departure date"
      />
      {/* preview */}
    </div>
  )
}
