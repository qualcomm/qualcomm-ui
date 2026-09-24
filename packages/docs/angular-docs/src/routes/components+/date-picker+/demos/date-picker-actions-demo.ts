import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-actions-demo",
  template: `
    <!-- preview -->
    <q-date-picker
      class="w-64"
      label="Departure date"
      [closeOnSelect]="false"
    />
    <!-- preview -->
  `,
})
export class DatePickerActionsDemo {}
