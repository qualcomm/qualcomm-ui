import {Component, computed} from "@angular/core"
import {Check} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectItemIndicatorDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  providers: [provideIcons({Check})],
  selector: "[q-select-item-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="Check"></svg>
    </ng-content>
  `,
})
export class SelectItemIndicatorDirective extends CoreSelectItemIndicatorDirective {
  protected readonly qdsContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getItemIndicatorBindings()),
    )
  }
}
