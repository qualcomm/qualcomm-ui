import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <DatePicker
        label="Small"
        placeholder="MM/DD/YYYY"
        size="sm"
      />
      <DatePicker
        label="Medium"
        placeholder="MM/DD/YYYY"
        size="md"
      />
      <DatePicker
        label="Large"
        placeholder="MM/DD/YYYY"
        size="lg"
      />
      {/* preview */}
    </div>
  )
}
