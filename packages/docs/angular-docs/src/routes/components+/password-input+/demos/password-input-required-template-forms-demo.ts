import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule, FormsModule],
  selector: "password-input-required-template-forms-demo",
  template: `
    <!-- preview -->
    <q-password-input
      class="w-72"
      label="Required"
      placeholder="Enter a value"
      required
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class PasswordInputRequiredTemplateFormsDemo {
  readonly value = signal<string>("")
}
