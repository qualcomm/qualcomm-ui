import {Component} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-inline-demo",
  template: `
    <div class="flex flex-wrap items-start gap-8">
      <!-- preview -->
      <q-date-picker variant="inline" />
      <q-date-picker variant="inline" [headline]="false" />
      <!-- preview -->
    </div>
  `,
})
export class DatePickerInlineDemo {}
