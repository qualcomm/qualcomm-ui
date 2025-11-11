import {Component, computed} from "@angular/core"

import {CoreCheckboxControlDirective} from "@qualcomm-ui/angular-core/checkbox"

import {useQdsCheckboxContext} from "./qds-checkbox-context.service"

/**
 * Visual control that wraps the checkbox indicator.
 */
@Component({
  selector: "[q-checkbox-control]",
  standalone: false,
  template: `
    <ng-content>
      <div q-checkbox-indicator></div>
    </ng-content>
  `,
})
export class CheckboxControlComponent extends CoreCheckboxControlDirective {
  protected readonly qdsCheckboxContext = useQdsCheckboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxContext().getControlBindings()),
    )
  }
}
