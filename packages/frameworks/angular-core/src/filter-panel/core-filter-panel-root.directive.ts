// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
  type Signal,
} from "@angular/core"

import {useFilterSet} from "@qualcomm-ui/angular-core/filter-set"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {
  FilterSetApi,
  FilterSetApiProps,
  FilterSetApplyMode,
  FilterSetCollectionResolver,
  FilterSetOptionCounts,
  FilterSetRange,
} from "@qualcomm-ui/core/filter-set"
import type {
  FilterDefinitions,
  FilterId,
  FilterIdOfKind,
  FilterValues,
} from "@qualcomm-ui/core/filters"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {CoreFilterPanelRootBaseDirective} from "./core-filter-panel-root-base.directive"

@Directive()
export class CoreFilterPanelRootDirective<
  TDefs extends FilterDefinitions = FilterDefinitions,
>
  extends CoreFilterPanelRootBaseDirective
  implements OnInit, SignalifyInput<FilterSetApiProps<TDefs>>
{
  /**
   * Controls when filter changes are committed.
   * @option `'auto'`: changes are committed immediately.
   * @option `'manual'`: changes are staged in a draft and committed when applied.
   *
   * @default 'auto'
   */
  readonly applyMode = input<FilterSetApplyMode | undefined>()

  /**
   * The initial committed filters. Use when you don't need to control the
   * committed filters.
   *
   * @default {}
   */
  readonly defaultValue = input<FilterValues<TDefs> | undefined>()

  /**
   * The filter definitions, created with `defineFilters`. Every filter rendered
   * in the panel must use a definition from this object.
   */
  readonly filters = input.required<TDefs>()

  /**
   * Resolves the collection of a list or tree filter whose definition has
   * none. Called during change detection, so it must not fetch. Load the data
   * elsewhere, such as with a query library, and return its data. Return
   * `undefined` for filters this resolver doesn't handle, or while the data
   * loads. A filter without a collection shows no options.
   */
  readonly getFilterCollection = input<
    FilterSetCollectionResolver<TDefs> | undefined
  >()

  /**
   * Resolves a filter's label when its definition has none. Return `undefined`
   * to fall back to the filter id.
   */
  readonly getFilterLabel = input<
    ((id: FilterId<TDefs>) => string | undefined) | undefined
  >()

  /**
   * Resolves the result count of each option in a filter, keyed by option
   * value. Called with the selection the controls display, so counts follow
   * the draft in `manual` mode. Options missing from the counts count 0.
   * Checkbox and radio filters show the counts and disable unselected options
   * with a count of 0. Checkbox tree filters show the counts of their leaves.
   * Return `undefined` to show no counts for the filter. Not called for range,
   * date, and text filters.
   */
  readonly getFilterOptionCounts = input<
    | ((
        id: FilterId<TDefs>,
        values: FilterValues<TDefs>,
      ) => FilterSetOptionCounts | undefined)
    | undefined
  >()

  /**
   * Resolves the bounds of a range filter when its definition has none.
   */
  readonly getFilterRange = input<
    | ((id: FilterIdOfKind<TDefs, "range">) => FilterSetRange | undefined)
    | undefined
  >()

  /**
   * Additional check for empty filter values, applied after the built-in check
   * for `undefined`, `null`, `""`, `[]`, and unbounded ranges. Empty values
   * remove the filter.
   */
  readonly isEmptyValue = input<
    ((id: FilterId<TDefs>, value: unknown) => boolean) | undefined
  >()

  /**
   * The controlled committed filters.
   */
  readonly value = input<FilterValues<TDefs> | undefined>()

  /**
   * Emitted when the selection the controls display changes. In `manual` mode,
   * this is every change to the draft, including `reset` and a new `value`
   * replacing the draft. Use it to fetch option counts for the draft. In
   * `auto` mode, it is emitted with every committed change, after
   * {@link valueChanged}.
   */
  readonly draftValueChanged = output<FilterValues<TDefs>>()

  /**
   * Emitted when the committed filters change: on apply in `manual` mode, on
   * every change in `auto` mode.
   */
  readonly valueChanged = output<FilterValues<TDefs>>()

  /**
   * The panel's filter set. Read it after the panel initializes, such as from
   * the template through a template reference variable.
   */
  readonly filterSet: Signal<FilterSetApi<TDefs>> = computed(
    () => this.filterSetContextService.context() as FilterSetApi<TDefs>,
  )

  protected readonly injector = inject(Injector)

  ngOnInit() {
    const filterSet = useFilterSet<TDefs>(
      computed<Explicit<FilterSetApiProps<TDefs>>>(() => ({
        applyMode: this.applyMode(),
        defaultValue: this.defaultValue(),
        filters: this.filters(),
        getFilterCollection: this.getFilterCollection(),
        getFilterLabel: this.getFilterLabel(),
        getFilterOptionCounts: this.getFilterOptionCounts(),
        getFilterRange: this.getFilterRange(),
        isEmptyValue: this.isEmptyValue(),
        onDraftValueChange: (value) => this.draftValueChanged.emit(value),
        onValueChange: (value) => this.valueChanged.emit(value),
        value: this.value(),
      })),
      this.injector,
    )

    this.initFilterPanel(filterSet)
  }
}
