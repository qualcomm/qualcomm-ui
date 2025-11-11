import {Component, inject} from "@angular/core"
import {
  type AbstractControl,
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  type ValidatorFn,
} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value
    if (!password || password.trim().length === 0) {
      return {error: "Please enter your password"}
    }
    if (password.length < 8) {
      return {error: "Must be at least 8 characters long"}
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return {error: "Must contain at least one lowercase letter"}
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return {error: "Must contain at least one uppercase letter"}
    }
    if (!/(?=.*\d)/.test(password)) {
      return {error: "Must contain at least one number"}
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return {error: "Must contain at least one special character (@$!%*?&)"}
    }
    return null
  }
}

function confirmPasswordValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null
    }
    const password = control.parent.get(passwordControlName)?.value
    const confirmPassword = control.value
    if (!confirmPassword || confirmPassword.trim().length === 0) {
      return {error: "Please confirm your password"}
    }
    if (confirmPassword !== password) {
      return {error: "Passwords do not match"}
    }
    return null
  }
}
@Component({
  imports: [ReactiveFormsModule, ButtonModule, PasswordInputModule],
  selector: "password-input-reactive-forms-demo",
  template: `
    <form
      class="mx-auto flex w-full max-w-xs flex-col gap-3"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <div class="grid grid-cols-1 gap-4">
        <q-password-input
          #passwordField
          formControlName="password"
          label="Password"
          placeholder="Create password"
          [hint]="
            passwordField.isInvalid()
              ? null
              : 'must be 8+ characters with at least 1 number, lowercase, uppercase, and special character.'
          "
        />
        <q-password-input
          formControlName="confirmPassword"
          label="Confirm password"
          placeholder="Confirm password"
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
          Submit
        </button>
      </div>
    </form>
  `,
})
export class PasswordInputReactiveFormsDemo {
  form: FormGroup
  submissionAttempts = 0
  isSubmitting = false
  private fb = inject(FormBuilder)

  constructor() {
    this.form = this.fb.group({
      confirmPassword: ["", [confirmPasswordValidator("password")]],
      password: ["", {validators: [passwordValidator()]}],
    })
  }

  onSubmit(): void {
    this.submissionAttempts++
    if (this.form.valid) {
      this.isSubmitting = true
      console.log("Form submitted:", this.form.value)
    }
  }
}
