import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-multiple-demo",
  template: `
    <!-- preview -->
    <q-date-picker
      class="w-80"
      label="Maintenance days"
      selectionMode="multiple"
      [maxSelectedDates]="4"
    />
    <!-- preview -->
  `,
})
export class DatePickerMultipleDemo {}
