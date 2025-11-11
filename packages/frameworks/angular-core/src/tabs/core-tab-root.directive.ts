// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {TabProps} from "@qualcomm-ui/core/tabs"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {TabContextService} from "./tab-context.service"
import {useTabsContext} from "./tabs-context.service"

@Directive()
export class CoreTabRootDirective implements OnInit, SignalifyInput<TabProps> {
  /**
   * Whether the tab is disabled
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The value of the tab
   */
  readonly value = input.required<string>()

  protected readonly tabsContext = useTabsContext()
  protected readonly tabApi = inject(TabContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.tabsContext().getTabBindings()
  })

  ngOnInit() {
    this.tabApi.init(
      computed<Explicit<TabProps>>(() => ({
        disabled: this.disabled(),
        value: this.value(),
      })),
    )

    this.trackBindings()
  }
}
