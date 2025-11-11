import {computed, Directive} from "@angular/core"

import {useForbiddenFormControlWarning} from "@qualcomm-ui/angular-core/forms"
import {CoreSwitchHiddenInputDirective} from "@qualcomm-ui/angular-core/switch"

import {useQdsSwitchContext} from "./qds-switch-context.service"

@Directive({
  selector: "[q-switch-hidden-input]",
  standalone: false,
})
export class SwitchHiddenInputDirective extends CoreSwitchHiddenInputDirective {
  protected readonly qdsSwitchContext = useQdsSwitchContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchContext().getHiddenInputBindings()),
    )
    useForbiddenFormControlWarning({
      directive: "q-switch-hidden-input",
      rootDirective: "q-switch",
    })
  }
}
