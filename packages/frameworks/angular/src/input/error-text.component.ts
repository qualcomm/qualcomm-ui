import {Component, input, type OnInit} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {type LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {inputClasses} from "@qualcomm-ui/qds-core/input"

import {useQdsInputContext} from "./qds-input-context.service"

/**
 * Simple error text directive. Not bound to any form or component context.
 *
 * @remarks if using a specific input component, use that component's error
 * text directive instead of this one.
 */
@Component({
  host: {
    "[class]": "inputClasses.errorText",
  },
  imports: [IconDirective],
  selector: "[q-error-text]",
  template: `
    @if (icon()) {
      <svg size="xs" [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class ErrorTextComponent implements OnInit {
  /**
   * Error indicator icon.
   */
  readonly icon = input<LucideIcon | string>()

  protected inputClasses = inputClasses

  protected qdsInputContext = useQdsInputContext({optional: true})

  protected trackBindings = useTrackBindings(() => {
    const context = this.qdsInputContext?.()
    return context?.getErrorTextBindings?.() || {}
  })

  ngOnInit() {
    this.trackBindings()
  }
}
