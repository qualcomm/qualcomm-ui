import {computed, Directive} from "@angular/core"

import {CoreTabsIndicatorDirective} from "@qualcomm-ui/angular-core/tabs"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Directive({
  selector: "[q-tabs-indicator]",
  standalone: false,
})
export class TabsIndicatorDirective extends CoreTabsIndicatorDirective {
  protected readonly qdsContext = useQdsTabsContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getIndicatorBindings()),
    )
  }
}
