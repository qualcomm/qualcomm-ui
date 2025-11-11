import {Component, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import {useInputErrorIndicator} from "@qualcomm-ui/angular/input"
import {CoreComboboxErrorIndicatorDirective} from "@qualcomm-ui/angular-core/combobox"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

@Component({
  selector: "[q-combobox-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()"></svg>
    </ng-content>
  `,
})
export class ComboboxErrorIndicatorDirective extends CoreComboboxErrorIndicatorDirective {
  /**
   * lucide-angular icon
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly inputErrorIndicatorContext = useInputErrorIndicator()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.inputErrorIndicatorContext.getBindings(),
    )
  }
}
