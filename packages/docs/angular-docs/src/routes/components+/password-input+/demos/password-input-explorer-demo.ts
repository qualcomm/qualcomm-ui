import {Component} from "@angular/core"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule],
  selector: "password-input-explorer-demo",
  template: `
    <q-password-input
      class="w-72"
      clearable
      hint="Some contextual help here"
      label="Password"
      placeholder="Enter password"
    />
  `,
})
export class PasswordInputExplorerDemo {}
