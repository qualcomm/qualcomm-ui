import {type ReactElement, useMemo} from "react"

import {
  DatePicker,
  getLocalTimeZone,
  today,
} from "@qualcomm-ui/react/date-picker"

export function DatePickerMinMaxDemo(): ReactElement {
  const now = useMemo(() => today(getLocalTimeZone()), [])

  return (
    // preview
    <DatePicker
      className="w-64"
      hint="Within the next 30 days"
      label="Departure date"
      max={now.add({days: 30})}
      min={now}
    />
    // preview
  )
}
