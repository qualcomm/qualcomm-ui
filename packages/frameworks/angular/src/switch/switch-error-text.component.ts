import {Component, computed, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreSwitchErrorTextDirective} from "@qualcomm-ui/angular-core/switch"

import {useQdsSwitchContext} from "./qds-switch-context.service"

@Component({
  selector: "[q-switch-error-text]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()!" />
    <ng-content />
  `,
})
export class SwitchErrorTextComponent extends CoreSwitchErrorTextDirective {
  /**
   * Error indicator icon.
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly qdsSwitchContext = useQdsSwitchContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchContext().getErrorTextBindings()),
    )
  }
}
