// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreFilterPanelFilterContentDirective} from "@qualcomm-ui/angular-core/filter-panel"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * The collapsible content of a filter. Holds the filter's control.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter-content>
 *   <q-checkbox-group-filter />
 * </div>
 * ```
 */
@Directive({
  exportAs: "filterPanelFilterContent",
  selector: "[q-filter-panel-filter-content]",
  standalone: false,
})
export class FilterPanelFilterContentDirective extends CoreFilterPanelFilterContentDirective {
  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFilterPanelContext().getFilterContentBindings()),
    )
  }
}
