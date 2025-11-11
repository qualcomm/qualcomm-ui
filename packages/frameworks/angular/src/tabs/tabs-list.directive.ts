import {Component, computed} from "@angular/core"

import {CoreTabsListDirective} from "@qualcomm-ui/angular-core/tabs"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Component({
  selector: "[q-tabs-list]",
  standalone: false,
  template: `
    <ng-content select="[q-tabs-indicator]">
      <div q-tabs-indicator></div>
    </ng-content>
    <ng-content />
  `,
})
export class TabsListDirective extends CoreTabsListDirective {
  protected readonly qdsContext = useQdsTabsContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getListBindings()),
    )
  }
}
