import {Component} from "@angular/core"

import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [DatePickerModule],
  selector: "date-picker-child-directives-demo",
  template: `
    <div class="flex flex-col gap-8">
      <!-- preview -->
      <q-date-picker class="w-64" label="Departure date">
        <div q-date-picker-actions>
          <button q-date-picker-cancel-trigger>Discard</button>
          <button q-date-picker-ok-trigger>Apply</button>
        </div>
      </q-date-picker>

      <q-date-picker
        selectionMode="multiple"
        variant="inline"
        [defaultValue]="defaultValue"
      >
        <span q-date-picker-headline-label>Travel dates</span>
        <span
          placeholder="No dates yet"
          q-date-picker-headline-value
          [moreLabel]="moreLabel"
        ></span>
      </q-date-picker>
      <!-- preview -->
    </div>
  `,
})
export class DatePickerChildDirectivesDemo {
  readonly defaultValue = [
    parseDate("2026-08-10"),
    parseDate("2026-08-14"),
    parseDate("2026-08-19"),
  ]

  readonly moreLabel = (count: number) => `and ${count} more`
}
