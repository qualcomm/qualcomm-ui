import {Component, computed} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {CoreComboboxTriggerDirective} from "@qualcomm-ui/angular-core/combobox"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  providers: [provideIcons({ChevronDown})],
  selector: "[q-combobox-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="ChevronDown"></svg>
    </ng-content>
  `,
})
export class ComboboxTriggerDirective extends CoreComboboxTriggerDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getIndicatorBindings()),
    )
  }
}
