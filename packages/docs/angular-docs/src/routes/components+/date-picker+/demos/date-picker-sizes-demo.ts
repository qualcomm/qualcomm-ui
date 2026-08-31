import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-date-picker class="w-64" label="Small" size="sm" />
      <q-date-picker class="w-64" label="Medium" size="md" />
      <q-date-picker class="w-64" label="Large" size="lg" />
      <!-- preview -->
    </div>
  `,
})
export class DatePickerSizesDemo {}
