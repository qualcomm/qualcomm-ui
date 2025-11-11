// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreTabDismissButtonDirective} from "@qualcomm-ui/angular-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Component({
  providers: [provideIcons({X})],
  selector: "[q-tab-dismiss-button]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="inlineIconButtonApi().getIconBindings()" />
  `,
})
export class TabDismissButtonDirective extends CoreTabDismissButtonDirective {
  protected readonly qdsContext = useQdsTabsContext()

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "md",
    variant: "fixed",
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
