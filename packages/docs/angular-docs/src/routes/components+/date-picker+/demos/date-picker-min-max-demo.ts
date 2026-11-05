import {Component} from "@angular/core"

import {
  DatePickerModule,
  getLocalTimeZone,
  today,
} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-min-max-demo",
  template: `
    <!-- preview -->
    <q-date-picker
      class="w-64"
      hint="Within the next 30 days"
      label="Departure date"
      [max]="max"
      [min]="min"
    />
    <!-- preview -->
  `,
})
export class DatePickerMinMaxDemo {
  readonly min = today(getLocalTimeZone())
  readonly max = this.min.add({days: 30})
}
