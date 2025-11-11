import {computed, Directive} from "@angular/core"

import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {CoreTabsPanelDirective} from "@qualcomm-ui/angular-core/tabs"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Directive({
  providers: [providePresenceContext()],
  selector: "[q-tabs-panel]",
  standalone: false,
})
export class TabsPanelDirective extends CoreTabsPanelDirective {
  protected readonly qdsContext = useQdsTabsContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPanelBindings()),
    )
  }
}
