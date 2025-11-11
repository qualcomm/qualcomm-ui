import {Component, inject} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule, ReactiveFormsModule, ButtonModule],
  selector: "switch-reactive-forms",
  template: `
    <form
      class="flex w-56 flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <label formControlName="acceptTerms" q-switch-root>
        <input q-switch-hidden-input />
        <div q-switch-control></div>
        <span q-switch-label>Accept Terms of Service</span>
        <span q-switch-error-text>
          Please accept the Terms of Service to continue
        </span>
      </label>

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
export class SwitchReactiveFormsDemo {
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
