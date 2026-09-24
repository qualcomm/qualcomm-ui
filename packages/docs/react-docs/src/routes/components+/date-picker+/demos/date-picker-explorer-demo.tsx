import type {ReactElement} from "react"

import {
  DatePicker,
  getLocalTimeZone,
  parseDate,
  today,
} from "@qualcomm-ui/react/date-picker"

export function DatePickerExplorerDemo(): ReactElement {
  return (
    <DatePicker
      className="w-64"
      defaultOpen
      defaultValue={[parseDate("2026-08-14")]}
      hint="Choose a date in mm/dd/yyyy format"
      label="Departure date"
      portalProps={{disabled: true}}
      presets={[
        {label: "Today", value: [today(getLocalTimeZone())]},
        {label: "Tomorrow", value: [today(getLocalTimeZone()).add({days: 1})]},
      ]}
    />
  )
}
