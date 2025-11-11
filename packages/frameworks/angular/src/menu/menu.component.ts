import {Component, computed, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreMenuRootDirective,
  provideMenuContext,
  provideMenuMachineContext,
  provideMenuTriggerContext,
} from "@qualcomm-ui/angular-core/menu"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsMenuApi,
  type QdsMenuApiProps,
  type QdsMenuSize,
} from "@qualcomm-ui/qds-core/menu"

import {
  provideQdsMenuContext,
  QdsMenuContextService,
} from "./qds-menu-context.service"

@Component({
  providers: [
    provideMenuContext(),
    provideMenuTriggerContext(),
    provideMenuMachineContext(),
    providePresenceContext(),
    provideQdsMenuContext(),
  ],
  selector: "q-menu",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <ng-content />
  `,
})
export class MenuComponent
  extends CoreMenuRootDirective
  implements SignalifyInput<QdsMenuApiProps>, OnInit
{
  readonly size = input<QdsMenuSize>()

  readonly qdsMenuService = inject(QdsMenuContextService)

  override ngOnInit() {
    super.ngOnInit()

    const qdsMenuApi = computed(() =>
      createQdsMenuApi({size: this.size()}, normalizeProps),
    )

    this.qdsMenuService.init(qdsMenuApi)
  }
}
