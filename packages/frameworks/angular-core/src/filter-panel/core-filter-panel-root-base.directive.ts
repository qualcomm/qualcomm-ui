// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type Signal} from "@angular/core"

import {FilterSetContextService} from "@qualcomm-ui/angular-core/filter-set"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {createFilterPanelApi} from "@qualcomm-ui/core/filter-panel"
import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"

import {FilterPanelContextService} from "./filter-panel-context.service"

/**
 * Shares a filter set with the panel's parts and binds the panel's root
 * element.
 */
@Directive()
export abstract class CoreFilterPanelRootBaseDirective {
  protected readonly filterSetContextService = inject(FilterSetContextService)

  protected readonly filterPanelContextService = inject(
    FilterPanelContextService,
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.filterPanelContextService.context().getRootBindings(),
  )

  protected initFilterPanel(filterSet: Signal<FilterSetApi<any>>): void {
    this.filterSetContextService.init(filterSet)
    this.filterPanelContextService.init(
      computed(() => createFilterPanelApi(filterSet(), normalizeProps)),
    )
    this.trackBindings()
  }
}
