import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInputClearTrigger} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectClearTriggerDirective} from "@qualcomm-ui/angular-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  providers: [provideIcons({X})],
  selector: "[q-select-clear-trigger]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="clearTriggerContext.getIconBindings()"></svg>
  `,
})
export class SelectClearTriggerDirective extends CoreSelectClearTriggerDirective {
  protected readonly clearTriggerContext = useInputClearTrigger()
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.clearTriggerContext.getRootBindings(),
          this.qdsSelectContext().getClearTriggerBindings(),
        ),
      ),
    )
  }
}
