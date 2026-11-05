import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-hide-outside-days-demo",
  template: `
    <div class="flex flex-wrap items-start gap-8">
      <!-- preview -->
      <q-date-picker hideOutsideDays variant="inline" />
      <!-- preview -->
    </div>
  `,
})
export class DatePickerHideOutsideDaysDemo {}
