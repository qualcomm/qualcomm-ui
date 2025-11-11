import {Component, computed} from "@angular/core"
import {Check} from "lucide-angular"

import {CoreComboboxItemIndicatorDirective} from "@qualcomm-ui/angular-core/combobox"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  providers: [provideIcons({Check})],
  selector: "[q-combobox-item-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="Check"></svg>
    </ng-content>
  `,
})
export class ComboboxItemIndicatorDirective extends CoreComboboxItemIndicatorDirective {
  protected readonly qdsContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getItemIndicatorBindings()),
    )
  }
}
