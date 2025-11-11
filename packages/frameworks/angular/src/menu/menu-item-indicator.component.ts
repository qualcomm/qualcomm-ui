import {Component, computed} from "@angular/core"
import {Check} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreMenuItemIndicatorDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  providers: [provideIcons({Check})],
  selector: "[q-menu-item-indicator]",
  standalone: false,
  template: `
    <ng-content />
    <svg qIcon="Check"></svg>
  `,
})
export class MenuItemIndicatorComponent extends CoreMenuItemIndicatorDirective {
  readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getItemIndicatorBindings()),
    )
  }
}
