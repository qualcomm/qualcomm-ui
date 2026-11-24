// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreFilterPanelFilterTriggerDirective} from "@qualcomm-ui/angular-core/filter-panel"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * Expands and collapses the filter's content. Renders the filter's label,
 * count, and indicator when it has no content.
 *
 * @example
 * ```angular-html
 * <button q-filter-panel-filter-trigger></button>
 * ```
 */
@Component({
  selector: "[q-filter-panel-filter-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <span q-filter-panel-filter-label></span>
      <span q-filter-panel-filter-count></span>
      <span q-filter-panel-filter-indicator></span>
    </ng-content>
  `,
})
export class FilterPanelFilterTriggerComponent extends CoreFilterPanelFilterTriggerDirective {
  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFilterPanelContext().getFilterTriggerBindings()),
    )
  }
}
