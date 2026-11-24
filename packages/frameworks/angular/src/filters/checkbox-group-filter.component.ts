// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, type OnInit} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {createCheckboxGroupFilterApi} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A group of checkboxes, one per item of the filter's list collection. Selects
 * any number of items. Writes a `string[]`. The host element is the group.
 * Renders no checkboxes while the filter has no collection.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.status">
 *   <q-checkbox-group-filter />
 * </div>
 * ```
 */
@Component({
  selector: "q-checkbox-group-filter",
  standalone: false,
  template: `
    @for (option of options(); track option.value) {
      <label
        q-checkbox
        [disabled]="option.disabled"
        [ngModel]="option.checked"
        [ngModelOptions]="{standalone: true}"
        [size]="qdsContext().size"
        (ngModelChange)="option.setChecked($event)"
      >
        <span
          q-checkbox-label
          q-filter-option-label
          [count]="option.count"
          [label]="option.label"
        ></span>
      </label>
    }
  `,
})
export class CheckboxGroupFilterComponent implements OnInit {
  protected readonly filter = useFilter<ListFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter
      ? createCheckboxGroupFilterApi(filter, normalizeProps)
      : undefined
  })

  protected readonly options = computed(() => this.api()?.options ?? [])

  /**
   * The group keeps its QDS bindings while it has no options, so that the
   * filter panel can hide the empty content.
   */
  protected readonly trackBindings = useTrackBindings(() => {
    const api = this.api()
    const groupBindings = this.qdsContext().getOptionGroupBindings()
    return api?.options
      ? mergeProps(api.getRootBindings(), groupBindings)
      : groupBindings
  })

  ngOnInit() {
    this.trackBindings()
  }
}
