// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useFilterPanelContext} from "./filter-panel-context.service"

@Directive()
export class CoreFilterPanelApplyTriggerDirective implements OnInit {
  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.filterPanelContext().getApplyTriggerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
