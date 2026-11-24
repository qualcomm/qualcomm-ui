// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {useFilterPanelContext} from "@qualcomm-ui/angular-core/filter-panel"
import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"
import {createQdsNumberBadgeApi} from "@qualcomm-ui/qds-core/badge"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"
import {compact} from "@qualcomm-ui/utils/object"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * The number of values selected in the filter. Hidden when the filter is
 * empty.
 *
 * @example
 * ```angular-html
 * <button q-filter-panel-filter-trigger>
 *   <span q-filter-panel-filter-label></span>
 *   <span q-filter-panel-filter-count></span>
 *   <span q-filter-panel-filter-indicator></span>
 * </button>
 * ```
 */
@Component({
  selector: "[q-filter-panel-filter-count]",
  standalone: false,
  template: `
    <span>
      <ng-content>{{ displayValue() }}</ng-content>
    </span>
  `,
})
export class FilterPanelFilterCountComponent extends NumberBadgeDirective {
  protected readonly filterContext = useFilter()

  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  protected override readonly api = computed(() =>
    createQdsNumberBadgeApi(
      {
        ...this.badgeContext?.numberBadgeProps(),
        ...this.qdsFilterPanelContext().getFilterCountBadgeProps(),
        ...compact({
          disabled: this.disabled(),
          emphasis: this.emphasis(),
          max: this.max(),
          size: this.size(),
        }),
        value: this.value() ?? this.filterContext()?.count ?? 0,
      },
      normalizeProps,
    ),
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        const filter = this.filterContext()
        return mergeProps(
          filter
            ? this.filterPanelContext().getFilterCountBindings(filter)
            : {},
          this.qdsFilterPanelContext().getFilterCountBindings(),
        )
      }),
    )
  }
}
