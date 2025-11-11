import {Component} from "@angular/core"
import {KeyRound} from "lucide-angular"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

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
