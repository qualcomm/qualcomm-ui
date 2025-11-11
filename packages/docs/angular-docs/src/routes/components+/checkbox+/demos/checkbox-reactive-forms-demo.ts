import {Component, inject} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule, ReactiveFormsModule, ButtonModule],
  selector: "checkbox-reactive-forms",
  template: `
    <form
      class="flex w-56 flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <label
        errorText="Please accept the Terms of Service to continue"
        formControlName="acceptTerms"
        label="Accept Terms of Service"
        q-checkbox
      ></label>

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
export class CheckboxReactiveFormsDemo {
  private fb = inject(FormBuilder)

  form = this.fb.group({
    acceptTerms: [false, Validators.requiredTrue],
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
      acceptTerms: false,
    })
  }
}
