import {Component, inject, signal} from "@angular/core"
import {
  type AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  type ValidatorFn,
} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {ErrorTextComponent} from "@qualcomm-ui/angular/input"

// Custom validator that requires at least one checkbox to be selected
function atLeastOneSelectedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null
    }

    const values = Object.values(control.value)
    const hasSelection = values.some((value) => value === true)

    return hasSelection ? null : {atLeastOneRequired: true}
  }
}

@Component({
  imports: [
    CheckboxModule,
    ReactiveFormsModule,
    ButtonModule,
    ErrorTextComponent,
  ],
  selector: "checkbox-reactive-forms-advanced-validation",
  template: `
    <form
      class="flex w-72 flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <fieldset>
        <legend class="text-neutral-primary font-heading-xxs mb-1">
          Select your interests (at least one required):
        </legend>

        <div class="flex flex-col gap-1" formGroupName="interests">
          <label
            formControlName="technology"
            label="Technology"
            q-checkbox
          ></label>
          <label formControlName="sports" label="Sports" q-checkbox></label>
          <label formControlName="music" label="Music" q-checkbox></label>
          <label formControlName="travel" label="Travel" q-checkbox></label>

          @if (interestsGroup.invalid && interestsGroup.touched) {
            <div q-error-text>Please select at least one interest</div>
          }
        </div>
      </fieldset>

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
export class CheckboxAdvancedValidationDemo {
  readonly formSubmitted = signal<boolean>(false)

  private fb = inject(FormBuilder)

  form = this.fb.group({
    interests: this.fb.group(
      {
        music: false,
        sports: false,
        technology: false,
        travel: false,
      },
      {validators: atLeastOneSelectedValidator()},
    ),
  })

  get interestsGroup() {
    return this.form.get("interests")!
  }

  get selectedInterests() {
    const interests = this.interestsGroup.value
    return Object.entries(interests)
      .filter(([_, selected]) => selected)
      .map(([interest, _]) => interest)
  }

  onSubmit() {
    this.formSubmitted.set(true)
    if (this.form.valid) {
      console.log("Form submitted:", {
        ...this.form.value,
        selectedInterests: this.selectedInterests,
      })
    } else {
      this.form.markAllAsTouched()
    }
  }

  reset() {
    this.form.reset({
      interests: {
        music: false,
        sports: false,
        technology: false,
        travel: false,
      },
    })
    this.formSubmitted.set(false)
  }
}
