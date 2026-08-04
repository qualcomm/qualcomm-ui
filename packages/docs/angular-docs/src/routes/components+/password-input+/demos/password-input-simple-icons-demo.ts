import {Component} from "@angular/core"
import {KeyRound} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule],
  providers: [provideIcons({KeyRound})],
  selector: "password-input-simple-icons-demo",
  template: `
    <!-- preview -->
    <q-password-input
      class="w-72"
      label="Password"
      placeholder="Placeholder text"
      startIcon="KeyRound"
    />
    <!-- preview -->
  `,
})
export class PasswordInputSimpleIconsDemo {}
