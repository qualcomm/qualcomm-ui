// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreTabDismissButtonDirective} from "@qualcomm-ui/angular-core/tabs"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Component({
  providers: [provideIcons({LucideX})],
  selector: "[q-tab-dismiss-button]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="inlineIconButtonApi().getIconBindings()" />
  `,
})
export class TabDismissButtonDirective extends CoreTabDismissButtonDirective {
  protected readonly qdsContext = useQdsTabsContext()

  protected readonly inlineIconButtonApi = useIconButtonApi({
    density: "compact",
    emphasis: "neutral",
    size: "md",
    variant: "ghost",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.inlineIconButtonApi().getRootBindings(),
          this.qdsContext().getTabDismissButtonBindings(),
        ),
      ),
    )
  }
}
