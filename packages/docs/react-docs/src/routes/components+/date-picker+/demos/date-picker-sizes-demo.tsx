import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <DatePicker className="w-64" label="Small" size="sm" />
      <DatePicker className="w-64" label="Medium" size="md" />
      <DatePicker className="w-64" label="Large" size="lg" />
      {/* preview */}
    </div>
  )
}
