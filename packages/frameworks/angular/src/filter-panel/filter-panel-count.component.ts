// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {useFilterPanelContext} from "@qualcomm-ui/angular-core/filter-panel"
import {useFilterSetContext} from "@qualcomm-ui/angular-core/filter-set"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"
import {createQdsNumberBadgeApi} from "@qualcomm-ui/qds-core/badge"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"
import {compact} from "@qualcomm-ui/utils/object"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * The total number of selected values in the panel. Hidden when no filters are
 * set.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-heading>
 *   Filters
 *   <span q-filter-panel-count></span>
 * </div>
 * ```
 */
@Component({
  selector: "[q-filter-panel-count]",
  standalone: false,
  template: `
    <span>
      <ng-content>{{ displayValue() }}</ng-content>
    </span>
  `,
})
export class FilterPanelCountComponent extends NumberBadgeDirective {
  protected readonly filterSetContext = useFilterSetContext()

  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  protected override readonly api = computed(() =>
    createQdsNumberBadgeApi(
      {
        ...this.badgeContext?.numberBadgeProps(),
        ...this.qdsFilterPanelContext().getCountBadgeProps(),
        ...compact({
          disabled: this.disabled(),
          emphasis: this.emphasis(),
          max: this.max(),
          size: this.size(),
        }),
        value: this.value() ?? this.filterSetContext().draftValueCount,
      },
      normalizeProps,
    ),
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.filterPanelContext().getCountBindings(),
          this.qdsFilterPanelContext().getCountBindings(),
        ),
      ),
    )
  }
}
