import {computed, Directive} from "@angular/core"

import {
  CoreComboboxItemDirective,
  provideComboboxItemContext,
} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  providers: [provideComboboxItemContext()],
  selector: "[q-combobox-item]",
  standalone: false,
})
export class ComboboxItemDirective extends CoreComboboxItemDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getItemBindings()),
    )
  }
}
