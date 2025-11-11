// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTabsContext} from "./tabs-context.service"

@Directive()
export class CoreTabsListDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly tabsContext = useTabsContext()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.tabsContext().getListBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  ngOnInit() {
    this.trackBindings()
  }
}
