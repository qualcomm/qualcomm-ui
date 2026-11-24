// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input} from "@angular/core"

import {CoreFilterPanelRootProviderDirective} from "@qualcomm-ui/angular-core/filter-panel"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {
  QdsFilterPanelApiProps,
  QdsFilterPanelSize,
} from "@qualcomm-ui/qds-core/filter-panel"

import {
  provideQdsFilterPanelRoot,
  useQdsFilterPanelRoot,
} from "./qds-filter-panel-root"

/**
 * The root element of a filter panel whose filter set was created with
 * `useFilterSet`.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-root-provider [value]="filterSet()">
 *   <div q-filter-panel-filter [filter]="filters.status">
 *     <q-checkbox-group-filter />
 *   </div>
 * </div>
 * ```
 */
@Directive({
  providers: [provideQdsFilterPanelRoot()],
  selector: "[q-filter-panel-root-provider]",
  standalone: false,
})
export class FilterPanelRootProviderDirective
  extends CoreFilterPanelRootProviderDirective
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
