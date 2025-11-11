import {computed, Directive} from "@angular/core"

import {CoreComboboxContentDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  selector: "[q-combobox-content]",
  standalone: false,
})
export class ComboboxContentDirective extends CoreComboboxContentDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getContentBindings()),
    )
  }
}
