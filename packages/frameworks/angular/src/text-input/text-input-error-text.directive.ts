import {Component, input} from "@angular/core"

import {useInputErrorText} from "@qualcomm-ui/angular/input"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {CoreTextInputErrorTextDirective} from "@qualcomm-ui/angular-core/text-input"

/**
 * Error message displayed when the input is invalid.
 */
@Component({
  selector: "[q-text-input-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class TextInputErrorTextDirective extends CoreTextInputErrorTextDirective {
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
