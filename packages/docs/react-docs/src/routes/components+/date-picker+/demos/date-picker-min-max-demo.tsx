import type {ReactElement} from "react"
import {useState} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerMinMaxDemo(): ReactElement {
  const [value, setValue] = useState<Date | null>(null)

  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() - 7)

  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 30)

  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <DatePicker
        hint="Select a date within the next 30 days"
        label="Appointment Date"
        max={maxDate}
        min={minDate}
        placeholder="MM/DD/YYYY"
        value={value}
        onValueChange={(details) => setValue(details.value)}
      />
      {/* preview */}
    </div>
  )
}
