// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {provideFilterContext} from "@qualcomm-ui/angular-core/filter-set"
import type {FilterDefinition} from "@qualcomm-ui/core/filters"

import {FilterPanelFilterRootDirective} from "./filter-panel-filter-root.directive"

/**
 * A collapsible filter section with a trigger that shows the filter's label,
 * count, and indicator. Its content is the filter's control. Expanded by
 * default.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.status">
 *   <q-checkbox-group-filter />
 * </div>
 * ```
 */
@Component({
  providers: [provideCollapsibleContext(), provideFilterContext()],
  selector: "[q-filter-panel-filter]",
  standalone: false,
  template: `
    <button q-filter-panel-filter-trigger>
      <ng-content select="[q-filter-panel-filter-label]">
        <span q-filter-panel-filter-label>
          {{ label() ?? filterState()?.label }}
        </span>
      </ng-content>
      <ng-content select="[q-filter-panel-filter-count]">
        <span q-filter-panel-filter-count></span>
      </ng-content>
      <ng-content select="[q-filter-panel-filter-indicator]">
        <span q-filter-panel-filter-indicator></span>
      </ng-content>
    </button>
    <div q-filter-panel-filter-content>
      <ng-content />
    </div>
  `,
})
export class FilterPanelFilterComponent<
  TDef extends FilterDefinition = FilterDefinition,
> extends FilterPanelFilterRootDirective<TDef> {
  /**
   * Overrides the text of the filter's label. The rendered label also names
   * the filter's control. `getFilterLabel` and value summaries keep the
   * resolved string.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-filter-panel-filter [filter]="filters.status">
   *   <span q-filter-panel-filter-label>...</span>
   *   <q-checkbox-group-filter />
   * </div>
   * ```
   */
  readonly label = input<string | undefined>()
}
