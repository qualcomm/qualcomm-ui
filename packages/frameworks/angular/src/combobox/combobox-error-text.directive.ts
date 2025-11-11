import {Component, input} from "@angular/core"

import {useInputErrorText} from "@qualcomm-ui/angular/input"
import {CoreComboboxErrorTextDirective} from "@qualcomm-ui/angular-core/combobox"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"

@Component({
  selector: "[q-combobox-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class ComboboxErrorTextDirective extends CoreComboboxErrorTextDirective {
  /**
   * Optional error indicator icon.
   */
  readonly icon = input<LucideIcon | string>()

  protected readonly errorTextContext = useInputErrorText()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.errorTextContext.getBindings())
  }
}
