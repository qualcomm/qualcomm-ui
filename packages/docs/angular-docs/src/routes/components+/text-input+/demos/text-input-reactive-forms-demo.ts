import {Component, inject} from "@angular/core"
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, ButtonModule, ReactiveFormsModule],
  selector: "text-input-reactive-forms-demo",
  template: `
    <form
      class="mx-auto flex w-96 flex-col gap-3"
      [formGroup]="addressForm"
      (ngSubmit)="onSubmit()"
    >
      <q-text-input
        class="w-full"
        errorText="Street address is required"
        formControlName="streetAddress"
        label="Stress Address"
        placeholder="123 Main St"
        [invalid]="isFieldInvalid('streetAddress')"
      />

      <q-text-input
        class="w-full"
        errorText="City is required"
        formControlName="city"
        label="City"
        placeholder="San Diego"
        [invalid]="isFieldInvalid('city')"
      />

      <div class="grid grid-cols-2 gap-4">
        <q-text-input
          class="w-full"
          errorText="State must be 2 characters"
          formControlName="state"
          label="State"
          placeholder="CA"
          [invalid]="isFieldInvalid('state')"
        />

        <q-text-input
          class="w-full"
          errorText="Zip code must be at least 5 characters"
          formControlName="zipCode"
          label="Zip Code"
          placeholder="10001"
          [invalid]="isFieldInvalid('zipCode')"
        />
      </div>

      <div class="mt-2 flex w-full justify-end">
        <button
          emphasis="primary"
          q-button
          type="submit"
          variant="fill"
          [disabled]="isSubmitting"
        >
          Save Address
        </button>
      </div>
    </form>
  `,
})
export class TextInputReactiveFormsDemo {
  isSubmitting = false

  readonly addressForm: FormGroup
  private fb = inject(FormBuilder)

  constructor() {
    this.addressForm = this.fb.group({
      city: ["", [Validators.required]],
      state: [
        "CA",
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      streetAddress: ["", [Validators.required]],
      zipCode: ["", [Validators.required, Validators.minLength(5)]],
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.isSubmitting = true
      console.log("Form submitted:", this.addressForm.value)
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false
      }, 1000)
    } else {
      // Mark all fields as touched to show validation errors
      this.addressForm.markAllAsTouched()
    }
  }
}
