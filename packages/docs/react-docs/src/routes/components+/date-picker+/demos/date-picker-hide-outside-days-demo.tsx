import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerHideOutsideDaysDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-start gap-8">
      {/* preview */}
      <DatePicker hideOutsideDays variant="inline" />
      {/* preview */}
    </div>
  )
}
