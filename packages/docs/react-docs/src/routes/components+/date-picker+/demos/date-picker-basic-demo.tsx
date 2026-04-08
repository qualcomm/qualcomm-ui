import type {ReactElement} from "react"
import {useState} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

export function DatePickerBasicDemo(): ReactElement {
  const [value, setValue] = useState<Date | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <DatePicker
        label="Select a date"
        placeholder="MM/DD/YYYY"
        value={value}
        onValueChange={(details) => setValue(details.value)}
      />
      {/* preview */}
      {value && (
        <p className="text-sm text-neutral-secondary">
          Selected: {value.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
