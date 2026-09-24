// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucidePanelLeftClose, LucidePanelLeftOpen} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreSideNavTriggerDirective} from "@qualcomm-ui/angular-core/side-nav"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({LucidePanelLeftClose, LucidePanelLeftOpen})],
  selector: "[q-side-nav-collapse-trigger]",
  standalone: false,
  template: `
    <svg
      [q-bind]="iconProps()"
      [qIcon]="open() ? 'PanelLeftClose' : 'PanelLeftOpen'"
    ></svg>
  `,
})
export class SideNavCollapseTriggerDirective extends CoreSideNavTriggerDirective {
  protected readonly qdsContext = useQdsSideNavContext()

  protected readonly open = computed(() => this.sideNavContext().open)

  protected readonly iconButtonApi = useIconButtonApi({
    density: "default",
    size: "md",
    variant: "ghost",
  })

  protected readonly iconProps = computed(() =>
    this.iconButtonApi().getIconBindings(),
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.iconButtonApi().getRootBindings(),
          this.qdsContext().getCollapseTriggerBindings(),
        ),
      ),
    )
  }
}
