import {computed, Directive} from "@angular/core"

import {CoreSwitchLabelDirective} from "@qualcomm-ui/angular-core/switch"

import {useQdsSwitchContext} from "./qds-switch-context.service"

@Directive({
  selector: "[q-switch-label]",
  standalone: false,
})
export class SwitchLabelDirective extends CoreSwitchLabelDirective {
  protected readonly qdsSwitchContext = useQdsSwitchContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchContext().getLabelBindings()),
    )
  }
}
