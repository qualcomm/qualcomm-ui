import {type ReactElement, useState} from "react"

import {DatePicker, type DateValue} from "@qualcomm-ui/react/date-picker"

export function DatePickerControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<(DateValue | null)[]>([])

  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <DatePicker
        className="w-80"
        label="Trip dates"
        onValueChange={(details) => setValue(details.value)}
        selectionMode="range"
        value={value}
      />
      {/* preview */}

      <pre className="text-sm">
        {JSON.stringify(value.map((date) => date?.toString() ?? null))}
      </pre>
    </div>
  )
}
