import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule, FormsModule],
  selector: "password-input-template-forms-demo",
  template: `
    <!-- preview -->
    <q-password-input
      class="w-72"
      label="Required"
      placeholder="Enter a value"
      [errorText]="errorText()"
      [invalid]="!!errorText()"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class PasswordInputTemplateFormsDemo {
  readonly value = signal<string>("")

  readonly errorText = computed(() => {
    const password = this.value()
    if (!password || password.trim().length === 0) {
      return "Please enter your password"
    }
    if (password.length < 8) {
      return "Must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Must contain at least one number"
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Must contain at least one special character (@$!%*?&)"
    }
    return undefined
  })
}
