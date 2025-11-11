import {Component, computed, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import {useInputErrorIndicator} from "@qualcomm-ui/angular/input"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreNumberInputErrorIndicatorDirective} from "@qualcomm-ui/angular-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

@Component({
  selector: "[q-number-input-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()"></svg>
    </ng-content>
  `,
})
export class NumberInputErrorIndicatorDirective extends CoreNumberInputErrorIndicatorDirective {
  /**
   * lucide-angular icon
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  readonly qdsNumberInputContext = useQdsNumberInputContext()
  readonly inputErrorIndicatorContext = useInputErrorIndicator()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        return mergeProps(
          this.inputErrorIndicatorContext.getBindings(),
          this.qdsNumberInputContext().getErrorIndicatorBindings(),
        )
      }),
    )
  }
}
