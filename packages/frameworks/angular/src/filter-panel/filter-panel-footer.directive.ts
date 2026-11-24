// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * The footer of the filter panel.
 */
@Directive({
  selector: "[q-filter-panel-footer]",
  standalone: false,
})
export class FilterPanelFooterDirective implements OnInit {
  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFilterPanelContext().getFooterBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
