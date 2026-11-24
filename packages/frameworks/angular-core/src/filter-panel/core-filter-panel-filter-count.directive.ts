// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useFilterPanelContext} from "./filter-panel-context.service"

@Directive()
export class CoreFilterPanelFilterCountDirective implements OnInit {
  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly filterContext = useFilter()

  protected readonly trackBindings = useTrackBindings(() => {
    const filter = this.filterContext()
    return filter
      ? this.filterPanelContext().getFilterCountBindings(filter)
      : {}
  })

  ngOnInit() {
    this.trackBindings()
  }
}
