import {Component, type OnInit, signal, viewChild} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {
  type PasswordInputComponent,
  PasswordInputModule,
} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule, FormsModule],
  selector: "password-input-error-text-demo",
  template: `
    <!-- preview -->
    <q-password-input
      #passwordInput
      class="w-64"
      errorText="You must enter your password"
      label="Label"
      placeholder="Enter your password"
      required
      [invalid]="!value()"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class PasswordInputErrorTextDemo implements OnInit {
  readonly value = signal<string>("")

  readonly passwordInput =
    viewChild.required<PasswordInputComponent>("passwordInput")

  ngOnInit() {
    this.passwordInput().control?.markAsDirty()
  }
}
