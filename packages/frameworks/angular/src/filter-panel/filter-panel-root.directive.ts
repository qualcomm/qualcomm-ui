// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input} from "@angular/core"

import {CoreFilterPanelRootDirective} from "@qualcomm-ui/angular-core/filter-panel"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import type {
  QdsFilterPanelApiProps,
  QdsFilterPanelSize,
} from "@qualcomm-ui/qds-core/filter-panel"

import {
  provideQdsFilterPanelRoot,
  useQdsFilterPanelRoot,
} from "./qds-filter-panel-root"

/**
 * The root element of the filter panel. Owns the panel's filter set. To share
 * the filter set with content outside the panel, create it with
 * `useFilterSet` and use `q-filter-panel-root-provider` instead.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-root [filters]="filters" (valueChanged)="value.set($event)">
 *   <div q-filter-panel-filter [filter]="filters.status">
 *     <q-checkbox-group-filter />
 *   </div>
 * </div>
 * ```
 */
@Directive({
  exportAs: "filterPanelRoot",
  providers: [provideQdsFilterPanelRoot()],
  selector: "[q-filter-panel-root]",
  standalone: false,
})
export class FilterPanelRootDirective<
  TDefs extends FilterDefinitions = FilterDefinitions,
>
  extends CoreFilterPanelRootDirective<TDefs>
  implements SignalifyInput<QdsFilterPanelApiProps>
{
  /**
   * The size of the filter panel and its controls.
   *
   * @default 'md'
   */
  readonly size = input<QdsFilterPanelSize | undefined>()

  protected readonly qdsFilterPanelRoot = useQdsFilterPanelRoot(this.size)

  constructor() {
    super()
    this.trackBindings.extendWith(this.qdsFilterPanelRoot.bindings)
  }

  override ngOnInit() {
    this.qdsFilterPanelRoot.init()
    super.ngOnInit()
  }
}
