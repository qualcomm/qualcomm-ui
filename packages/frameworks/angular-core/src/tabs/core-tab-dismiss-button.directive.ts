// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTabsContext} from "./tabs-context.service"

@Directive()
export class CoreTabDismissButtonDirective implements OnInit {
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  protected readonly tabsContext = useTabsContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.tabsContext().getTabDismissButtonBindings({
      "aria-label": this.ariaLabel(),
    })
  })

  ngOnInit() {
    this.trackBindings()
  }
}
