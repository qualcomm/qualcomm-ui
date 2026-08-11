import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-hint-demo",
  template: `
    <div class="flex flex-col gap-6">
      <!-- preview -->
      <q-date-picker
        class="w-64"
        hint="Choose a date in mm/dd/yyyy format"
        label="Departure date"
      />
      <q-date-picker
        class="w-64"
        errorText="A departure date is required"
        hint="Choose a date in mm/dd/yyyy format"
        invalid
        label="Departure date"
      />
      <!-- preview -->
    </div>
  `,
})
export class DatePickerHintDemo {}
