import {Component} from "@angular/core"

import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-states-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <q-date-picker
        class="w-64"
        disabled
        label="Disabled"
        [defaultValue]="departureDate"
      />
      <q-date-picker
        class="w-64"
        label="Read only"
        readOnly
        [defaultValue]="departureDate"
      />
      <q-date-picker
        class="w-64"
        errorText="Choose a later date"
        invalid
        label="Invalid"
        [defaultValue]="departureDate"
      />
      <!-- preview -->
    </div>
  `,
})
export class DatePickerStatesDemo {
  readonly departureDate = [parseDate("2026-08-14")]
}
