import {computed, Directive} from "@angular/core"

import {CoreComboboxPositionerDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  selector: "[q-combobox-positioner]",
  standalone: false,
})
export class ComboboxPositionerDirective extends CoreComboboxPositionerDirective {
  protected readonly qdsContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPositionerBindings()),
    )
  }
}
