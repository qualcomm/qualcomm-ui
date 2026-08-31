import type {ReactElement} from "react"

import {DatePicker, type DatePickerPreset} from "@qualcomm-ui/react/date-picker"

const presets: DatePickerPreset[] = [
  {label: "Next 7 days", value: "next7Days"},
  {label: "Next 14 days", value: "next14Days"},
  {label: "Next 30 days", value: "next30Days"},
  {label: "Next 90 days", value: "next90Days"},
  {label: "Next week", value: "nextWeek"},
  {label: "Next month", value: "nextMonth"},
  {label: "Next quarter", value: "nextQuarter"},
  {label: "Next year", value: "nextYear"},
]

export function DatePickerPresetsDemo(): ReactElement {
  return (
    <DatePicker
      className="w-80"
      label="Date range"
      presets={presets}
      selectionMode="range"
    />
  )
}
