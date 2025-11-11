import {Component, computed} from "@angular/core"

import {CoreCheckboxIndicatorDirective} from "@qualcomm-ui/angular-core/checkbox"

import {useQdsCheckboxContext} from "./qds-checkbox-context.service"

/**
 * Visual indicator rendered within the control that displays the checkbox state
 * (checked, indeterminate, or unchecked).
 */
@Component({
  selector: "[q-checkbox-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <q-checkmark-icon
        [indeterminate]="checkboxContext().indeterminate"
        [size]="qdsCheckboxContext().size"
      />
    </ng-content>
  `,
})
export class CheckboxIndicatorComponent extends CoreCheckboxIndicatorDirective {
  protected readonly qdsCheckboxContext = useQdsCheckboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxContext().getIndicatorBindings()),
    )
  }
}
