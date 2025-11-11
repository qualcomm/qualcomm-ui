import {computed, Directive} from "@angular/core"

import {CoreComboboxItemTextDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  selector: "[q-combobox-item-text]",
  standalone: false,
})
export class ComboboxItemTextDirective extends CoreComboboxItemTextDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getItemTextBindings()),
    )
  }
}
