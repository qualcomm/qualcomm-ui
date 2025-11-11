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
import {ErrorTextComponent} from "@qualcomm-ui/angular/input"
import {SwitchModule} from "@qualcomm-ui/angular/switch"

// Custom validator that requires at least one switch to be selected
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
    SwitchModule,
    ReactiveFormsModule,
    ButtonModule,
    ErrorTextComponent,
  ],
  selector: "switch-reactive-forms",
  template: `
    <form
      class="flex w-72 flex-col gap-2"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <fieldset>
        <legend class="text-neutral-primary font-heading-xxs mb-3">
          Select your interests (at least one required):
        </legend>

        <div class="flex flex-col gap-2" formGroupName="interests">
          <label formControlName="technology" q-switch-root>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>Technology</span>
          </label>

          <label formControlName="sports" q-switch-root>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>Sports</span>
          </label>

          <label formControlName="music" q-switch-root>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>Music</span>
          </label>

          <label formControlName="travel" q-switch-root>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>Travel</span>
          </label>

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
export class SwitchAdvancedValidationDemo {
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
