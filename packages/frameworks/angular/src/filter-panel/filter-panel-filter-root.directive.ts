// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {provideCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {CoreFilterPanelFilterRootDirective} from "@qualcomm-ui/angular-core/filter-panel"
import {provideFilterContext} from "@qualcomm-ui/angular-core/filter-set"
import type {FilterDefinition} from "@qualcomm-ui/core/filters"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * A collapsible filter section. Provides the filter's state to its trigger,
 * content, and control. Expanded by default. Intended to be used with the
 * composite elements:
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter-root [filter]="filters.status">
 *   <button q-filter-panel-filter-trigger>
 *     <span q-filter-panel-filter-label></span>
 *     <span q-filter-panel-filter-count></span>
 *     <span q-filter-panel-filter-indicator></span>
 *   </button>
 *   <div q-filter-panel-filter-content>
 *     <q-checkbox-group-filter />
 *   </div>
 * </div>
 * ```
 */
@Directive({
  providers: [provideCollapsibleContext(), provideFilterContext()],
  selector: "[q-filter-panel-filter-root]",
  standalone: false,
})
export class FilterPanelFilterRootDirective<
  TDef extends FilterDefinition = FilterDefinition,
> extends CoreFilterPanelFilterRootDirective<TDef> {
  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFilterPanelContext().getFilterBindings()),
    )
  }
}
