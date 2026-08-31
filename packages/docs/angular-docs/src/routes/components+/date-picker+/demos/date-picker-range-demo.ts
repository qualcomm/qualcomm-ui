import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-range-demo",
  template: `
    <!-- preview -->
    <q-date-picker class="w-80" label="Trip dates" selectionMode="range" />
    <!-- preview -->
  `,
})
export class DatePickerRangeDemo {}
