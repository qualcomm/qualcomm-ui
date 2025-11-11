import {Component, inject} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule, ReactiveFormsModule, ButtonModule],
  selector: "radio-reactive-forms-demo",
  template: `
    <form
      class="flex w-56 flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <!-- preview -->
      <fieldset formControlName="language" q-radio-group>
        <div q-radio-group-label>Language</div>
        <div q-radio-group-items>
          <label label="HTML" q-radio value="html"></label>
          <label label="CSS" q-radio value="css"></label>
          <label label="TypeScript" q-radio value="ts"></label>
        </div>
        <div q-radio-group-error-text>You must select a value</div>
      </fieldset>
      <!-- preview -->

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
export class RadioReactiveFormsDemo {
  private fb = inject(FormBuilder)

  form = this.fb.group({
    language: [null, Validators.required],
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
      language: null,
    })
  }
}
