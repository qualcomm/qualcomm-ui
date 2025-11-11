import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInputClearTrigger} from "@qualcomm-ui/angular/input"
import {CoreComboboxClearTriggerDirective} from "@qualcomm-ui/angular-core/combobox"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  providers: [provideIcons({X})],
  selector: "[q-combobox-clear-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="clearTriggerContext.getIconBindings()"></svg>
    </ng-content>
  `,
})
export class ComboboxClearTriggerDirective extends CoreComboboxClearTriggerDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  protected readonly clearTriggerContext = useInputClearTrigger()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.clearTriggerContext.getRootBindings(),
          this.qdsComboboxContext().getClearTriggerBindings(),
        ),
      ),
    )
  }
}
