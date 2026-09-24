import {Component} from "@angular/core"

import {
  type DatePickerPreset,
  DatePickerModule,
  getLocalTimeZone,
  parseDate,
  today,
} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-explorer-demo",
  template: `
    <q-date-picker
      class="w-64"
      defaultOpen
      disablePortal
      hint="Choose a date in mm/dd/yyyy format"
      label="Departure date"
      [defaultValue]="defaultValue"
      [presets]="presets"
    />
  `,
})
export class DatePickerExplorerDemo {
  readonly defaultValue = [parseDate("2026-08-14")]

  readonly presets: DatePickerPreset[] = [
    {label: "Today", value: [today(getLocalTimeZone())]},
    {label: "Tomorrow", value: [today(getLocalTimeZone()).add({days: 1})]},
  ]
}
