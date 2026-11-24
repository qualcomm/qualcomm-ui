// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {
  createSelectFilterApi,
  type FilterControlLabelProps,
} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import type {SelectPositioningOptions} from "@qualcomm-ui/core/select"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {isEqual} from "@qualcomm-ui/utils/equal"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A select listing the items of the filter's list collection. Supports
 * `multiple`. Writes a `string[]`.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.region">
 *   <q-select-filter placeholder="Select a region" />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-select-filter",
  standalone: false,
  template: `
    @if (api(); as api) {
      <q-select
        [aria-label]="labelProps()['aria-label']"
        [aria-labelledby]="labelProps()['aria-labelledby']"
        [clearable]="clearable()"
        [collection]="api.collection"
        [disabled]="!!disabled()"
        [multiple]="multiple()"
        [ngModel]="selectedItems()"
        [ngModelOptions]="{standalone: true}"
        [placeholder]="placeholder()"
        [positioning]="positioning()"
        [size]="qdsContext().size"
        (ngModelChange)="api.setValue(api.collection.getValues($event))"
      />
    }
  `,
})
export class SelectFilterComponent {
  /**
   * When `true`, renders a clear button that resets the value on click.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Controls whether the select is disabled.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to allow multiple selection.
   *
   * @default false
   */
  readonly multiple = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The placeholder text of the select.
   */
  readonly placeholder = input<string | undefined>()

  /**
   * The positioning options of the menu.
   *
   * @inheritDoc
   */
  readonly positioning = input<SelectPositioningOptions | undefined>()

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filter = useFilter<ListFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter ? createSelectFilterApi(filter) : undefined
  })

  protected readonly labelProps = computed<FilterControlLabelProps>(
    () => this.api()?.getLabelProps() ?? {},
  )

  /**
   * The select's form value is its selected items. Compared by value so that
   * unrelated filter changes don't write an equal value to the select.
   */
  protected readonly selectedItems = computed(
    () => {
      const api = this.api()
      return api ? api.collection.findMany(api.value) : []
    },
    {equal: isEqual},
  )
}
