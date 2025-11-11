import {Component} from "@angular/core"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule],
  selector: "password-input-simple-demo",
  template: `
    <!-- preview -->
    <q-password-input
      class="w-72"
      clearable
      hint="Optional hint"
      label="Password"
      placeholder="Create password"
    />
    <!-- preview -->
  `,
})
export class PasswordInputSimpleDemo {}
