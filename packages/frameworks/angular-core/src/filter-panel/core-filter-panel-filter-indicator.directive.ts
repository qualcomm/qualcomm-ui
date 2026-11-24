// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useFilterPanelContext} from "./filter-panel-context.service"

@Directive()
export class CoreFilterPanelFilterIndicatorDirective implements OnInit {
  protected readonly collapsibleContext = useCollapsibleContext()

  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.filterPanelContext().getFilterIndicatorBindings({
      open: this.collapsibleContext().open,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
