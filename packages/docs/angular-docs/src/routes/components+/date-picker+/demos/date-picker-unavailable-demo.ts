import {Component} from "@angular/core"

import {DatePickerModule, isWeekend} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-unavailable-demo",
  template: `
    <!-- preview -->
    <q-date-picker
      class="w-64"
      hint="Weekends are not available"
      label="Delivery date"
      [isDateUnavailable]="isWeekend"
    />
    <!-- preview -->
  `,
})
export class DatePickerUnavailableDemo {
  readonly isWeekend = isWeekend
}
