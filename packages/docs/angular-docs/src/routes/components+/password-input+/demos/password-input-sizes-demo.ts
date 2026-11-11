import {Component} from "@angular/core"
import {LucideKeyRound} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

@Component({
  imports: [PasswordInputModule],
  providers: [provideIcons({LucideKeyRound})],
  selector: "password-input-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-password-input
        aria-label="Password"
        class="w-56"
        placeholder="sm"
        size="sm"
        startIcon="KeyRound"
      />
      <q-password-input
        aria-label="Password"
        class="w-64"
        placeholder="md"
        size="md"
        startIcon="KeyRound"
      />
      <q-password-input
        aria-label="Password"
        class="w-72"
        placeholder="lg"
        size="lg"
        startIcon="KeyRound"
      />
      <!-- preview -->
    </div>
  `,
})
export class PasswordInputSizesDemo {}
