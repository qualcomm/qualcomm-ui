import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-single-demo",
  template: `
    <!-- preview -->
    <q-date-picker class="w-64" label="Departure date" />
    <!-- preview -->
  `,
})
export class DatePickerSingleDemo {}
