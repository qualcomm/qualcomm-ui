import {Component, inject} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"
import type {DateValue} from "@qualcomm-ui/core/date-picker"

@Component({
  imports: [DatePickerModule, ReactiveFormsModule, ButtonModule],
  selector: "date-picker-reactive-forms-demo",
  template: `
    <form
      class="flex w-64 flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <q-date-picker
        errorText="A departure date is required"
        formControlName="departureDate"
        hint="Choose a date in mm/dd/yyyy format"
        label="Departure date"
      />

      <div class="mt-1 grid grid-cols-2 grid-rows-1 gap-3">
        <button
          emphasis="primary"
          q-button
          size="sm"
          type="button"
          variant="outline"
          (click)="reset()"
        >
          Reset
        </button>
        <button
          emphasis="primary"
          q-button
          size="sm"
          type="submit"
          variant="fill"
        >
          Submit
        </button>
      </div>
    </form>
  `,
})
export class DatePickerReactiveFormsDemo {
  private fb = inject(FormBuilder)

  form = this.fb.group({
    departureDate: [[] as (DateValue | null)[], Validators.required],
  })

  onSubmit() {
    if (this.form.valid) {
      console.log("Form submitted:", {
        ...this.form.value,
      })
    }
  }

  reset() {
    this.form.reset({
      departureDate: [],
    })
  }
}
