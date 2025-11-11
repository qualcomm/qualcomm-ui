import {Component} from "@angular/core"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule],
  selector: "password-input-child-directives-demo",
  template: `
    <!-- preview -->
    <q-password-input class="w-72" clearable placeholder="Create password">
      <div q-password-input-label>Password</div>
      <div q-password-input-hint>Optional hint</div>
    </q-password-input>
    <!-- preview -->
  `,
})
export class PasswordInputChildDirectivesDemo {}
