// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * A group of related filters within the filter panel.
 */
@Directive({
  selector: "[q-filter-panel-section]",
  standalone: false,
})
export class FilterPanelSectionDirective implements OnInit {
  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFilterPanelContext().getSectionBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
