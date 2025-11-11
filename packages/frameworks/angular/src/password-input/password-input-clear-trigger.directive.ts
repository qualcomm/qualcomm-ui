import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInputClearTrigger} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputClearTriggerDirective} from "@qualcomm-ui/angular-core/password-input"

@Component({
  providers: [provideIcons({X})],
  selector: "[q-password-input-clear-trigger]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="clearTriggerContext.getIconBindings()"></svg>
  `,
})
export class PasswordInputClearTriggerDirective extends CorePasswordInputClearTriggerDirective {
  protected readonly clearTriggerContext = useInputClearTrigger()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.clearTriggerContext.getRootBindings()),
    )
  }
}
