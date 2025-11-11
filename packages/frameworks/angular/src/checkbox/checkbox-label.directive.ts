import {computed, Directive} from "@angular/core"

import {CoreCheckboxLabelDirective} from "@qualcomm-ui/angular-core/checkbox"

import {useQdsCheckboxContext} from "./qds-checkbox-context.service"

/**
 * An accessible label that is automatically associated with the checkbox.
 */
@Directive({
  selector: "[q-checkbox-label]",
  standalone: false,
})
export class CheckboxLabelDirective extends CoreCheckboxLabelDirective {
  protected readonly qdsCheckboxContext = useQdsCheckboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxContext().getLabelBindings()),
    )
  }
}
