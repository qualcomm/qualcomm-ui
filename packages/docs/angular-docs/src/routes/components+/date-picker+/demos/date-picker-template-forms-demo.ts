import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"
import type {DateValue} from "@qualcomm-ui/core/date-picker"

@Component({
  imports: [DatePickerModule, FormsModule],
  selector: "date-picker-template-forms-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-date-picker
        class="w-64"
        hint="Choose a date in mm/dd/yyyy format"
        label="Departure date"
        [(ngModel)]="value"
      />
      <!-- preview -->

      <output class="text-neutral-primary font-code-sm block">
        {{ formattedValue() }}
      </output>
    </div>
  `,
})
export class DatePickerTemplateFormsDemo {
  readonly value = signal<(DateValue | null)[]>([parseDate("2026-08-14")])

  readonly formattedValue = computed(
    () => this.value()[0]?.toString() ?? "No date selected",
  )
}
