// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {
  createRadioGroupFilterApi,
  type FilterControlLabelProps,
} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import type {RadioOrientation} from "@qualcomm-ui/core/radio"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A radio group, one radio per item of the filter's list collection. Selects
 * one item. Writes a one-item `string[]`. Renders nothing while the filter has
 * no collection.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.priority">
 *   <q-radio-group-filter anyLabel="Any" />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-radio-group-filter",
  standalone: false,
  template: `
    @if (api()?.options; as options) {
      <fieldset
        q-radio-group
        [aria-label]="labelProps()['aria-label']"
        [aria-labelledby]="labelProps()['aria-labelledby']"
        [disabled]="!!disabled()"
        [ngModel]="api()!.value"
        [ngModelOptions]="{standalone: true}"
        [orientation]="orientation()"
        [q-bind]="optionGroupBindings()"
        [size]="qdsContext().size"
        (ngModelChange)="api()?.setValue($event)"
      >
        <div q-radio-group-items>
          @for (option of options; track option.value) {
            <label q-radio [disabled]="option.disabled" [value]="option.value">
              <span
                q-filter-option-label
                q-radio-label
                [count]="option.count"
                [label]="option.label"
              ></span>
            </label>
          }
        </div>
      </fieldset>
    }
  `,
})
export class RadioGroupFilterComponent {
  /**
   * The label of a leading radio that clears the filter, such as "Any". Omit
   * to render only the collection's items.
   */
  readonly anyLabel = input<string | undefined>()

  /**
   * Controls whether the radio group is disabled.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Orientation of the radio group
   *
   * @default 'vertical'
   */
  readonly orientation = input<RadioOrientation>()

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filter = useFilter<ListFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter
      ? createRadioGroupFilterApi(filter, {anyLabel: this.anyLabel()})
      : undefined
  })

  protected readonly labelProps = computed<FilterControlLabelProps>(
    () => this.api()?.getLabelProps() ?? {},
  )

  protected readonly optionGroupBindings = computed(() =>
    this.qdsContext().getOptionGroupBindings(),
  )
}
