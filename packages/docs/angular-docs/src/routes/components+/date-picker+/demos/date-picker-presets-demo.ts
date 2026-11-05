import {Component} from "@angular/core"

import {
  type DatePickerPreset,
  DatePickerModule,
} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-presets-demo",
  template: `
    <!-- preview -->
    <q-date-picker
      class="w-80"
      label="Date range"
      selectionMode="range"
      [presets]="presets"
    />
    <!-- preview -->
  `,
})
export class DatePickerPresetsDemo {
  readonly presets: DatePickerPreset[] = [
    {label: "Next 7 days", value: "next7Days"},
    {label: "Next 14 days", value: "next14Days"},
    {label: "Next 30 days", value: "next30Days"},
    {label: "Next 90 days", value: "next90Days"},
    {label: "Next week", value: "nextWeek"},
    {label: "Next month", value: "nextMonth"},
    {label: "Next quarter", value: "nextQuarter"},
    {label: "Next year", value: "nextYear"},
  ]
}
