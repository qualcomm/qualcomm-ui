// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreTabRootDirective,
  provideTabContext,
} from "@qualcomm-ui/angular-core/tabs"

import {useQdsTabsContext} from "./qds-tabs-context.service"

@Directive({
  providers: [provideTabContext()],
  selector: "[q-tab-root]",
  standalone: false,
})
export class TabRootDirective extends CoreTabRootDirective {
  protected readonly qdsContext = useQdsTabsContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTabBindings()),
    )
  }
}
