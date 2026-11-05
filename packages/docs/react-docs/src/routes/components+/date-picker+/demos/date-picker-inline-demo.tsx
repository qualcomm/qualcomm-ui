import type {ReactElement} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerInlineDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-start gap-8">
      {/* preview */}
      <DatePicker variant="inline" />
      <DatePicker headline={false} variant="inline" />
      {/* preview */}
    </div>
  )
}
