import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerStatesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <DatePicker
        label="Disabled"
        placeholder="MM/DD/YYYY"
        disabled
      />
      <DatePicker
        errorText="Please select a valid date"
        label="Invalid"
        placeholder="MM/DD/YYYY"
        invalid
      />
      <DatePicker
        label="Read-only"
        placeholder="MM/DD/YYYY"
        readOnly
        value={new Date()}
      />
      {/* preview */}
    </div>
  )
}
