// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreFilterPanelFilterLabelDirective} from "@qualcomm-ui/angular-core/filter-panel"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * The filter's label. Renders the resolved label when it has no content. The
 * rendered label also names the filter's control. `getFilterLabel` and value
 * summaries keep the resolved string. To customize the label with the resolved
 * string, use `*filterContext`.
 *
 * @example
 * ```angular-html
 * <span q-filter-panel-filter-label *filterContext="let filter">
 *   {{ filter.label }} ({{ filter.definition.kind }})
 * </span>
 * ```
 */
@Component({
  selector: "[q-filter-panel-filter-label]",
  standalone: false,
  template: `
    <ng-content>{{ filterContext()?.label }}</ng-content>
  `,
})
export class FilterPanelFilterLabelComponent extends CoreFilterPanelFilterLabelDirective {
  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFilterPanelContext().getFilterLabelBindings()),
    )
  }
}
