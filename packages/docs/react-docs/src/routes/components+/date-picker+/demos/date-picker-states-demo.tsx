import type {ReactElement} from "react"

import {DatePicker, parseDate} from "@qualcomm-ui/react/date-picker"

const departureDate = [parseDate("2026-08-14")]

export function DatePickerStatesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <DatePicker
        className="w-64"
        defaultValue={departureDate}
        disabled
        label="Disabled"
      />
      <DatePicker
        className="w-64"
        defaultValue={departureDate}
        label="Read only"
        readOnly
      />
      <DatePicker
        className="w-64"
        defaultValue={departureDate}
        errorText="Choose a later date"
        invalid
        label="Invalid"
      />
      {/* preview */}
    </div>
  )
}
