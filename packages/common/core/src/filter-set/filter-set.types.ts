// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterDefinitions,
  FilterValueItem,
  FilterValues,
} from "@qualcomm-ui/core/filters"
import type {
  ListCollection,
  TreeCollection,
} from "@qualcomm-ui/utils/collection"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  MachineSchema,
  ValueOrFn,
} from "@qualcomm-ui/utils/machine"

/**
 * - `manual`: changes are staged in a draft and committed when applied.
 * - `auto`: changes are committed immediately.
 */
export type FilterSetApplyMode = "auto" | "manual"

/**
 * Filter values keyed by filter id. An empty filter is an absent key.
 */
export type FilterSetValues = Record<string, unknown>

/**
 * The collection a list or tree filter selects from.
 */
export type FilterSetCollection = ListCollection<any> | TreeCollection<any>

/**
 * Result counts keyed by option value.
 */
export type FilterSetOptionCounts = Record<string, number>

export interface FilterSetRange {
  max: number
  min: number
}

export interface FilterSetApiProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
> {
  /**
   * Controls when filter changes are committed.
   *
   * @default "auto"
   */
  applyMode?: FilterSetApplyMode | undefined

  /**
   * The initial committed filters. Use when you don't need to control the
   * committed filters.
   *
   * @default {}
   */
  defaultValue?: FilterValues<TDefs> | undefined

  /**
   * The filter definitions, created with `defineFilters`.
   */
  filters?: TDefs | undefined

  /**
   * Resolves the collection of a list or tree filter whose definition has
   * none. Called during render, so it must not fetch. Load the data elsewhere,
   * such as with a query library, and return its data. Return `undefined` for
   * filters this resolver doesn't handle, or while the data loads. A filter
   * without a collection shows no options.
   */
  getFilterCollection?:
    | ((id: keyof TDefs & string) => FilterSetCollection | undefined)
    | undefined

  /**
   * Resolves a filter's label when its definition has none. Return `undefined`
   * to fall back to the filter id.
   */
  getFilterLabel?:
    | ((id: keyof TDefs & string) => string | undefined)
    | undefined

  /**
   * Resolves the result count of each option in a filter, keyed by option
   * value. Called with the selection the controls display, so counts follow
   * the draft in `manual` mode. Options missing from the counts count 0.
   * Checkbox and radio filters show the counts and disable unselected options
   * with a count of 0. Return `undefined` to show no counts for the filter.
   */
  getFilterOptionCounts?:
    | ((
        id: keyof TDefs & string,
        values: FilterValues<TDefs>,
      ) => FilterSetOptionCounts | undefined)
    | undefined

  /**
   * Resolves the bounds of a range filter when its definition has none.
   */
  getFilterRange?:
    | ((id: keyof TDefs & string) => FilterSetRange | undefined)
    | undefined

  /**
   * Additional check for empty filter values, applied after the built-in check
   * for `undefined`, `null`, `""`, `[]`, and unbounded ranges. Empty values
   * remove the filter.
   */
  isEmptyValue?:
    | ((id: keyof TDefs & string, value: unknown) => boolean)
    | undefined

  /**
   * Called when the committed filters change: on apply in `manual` mode, on
   * every change in `auto` mode.
   */
  onValueChange?: ((value: FilterValues<TDefs>) => void) | undefined

  /**
   * The controlled committed filters.
   */
  value?: FilterValues<TDefs> | undefined
}

/**
 * Staged changes in `manual` mode.
 */
export interface FilterSetDraft {
  /**
   * Hash of the committed value the draft was started from.
   */
  base: string
  values: FilterSetValues
}

export interface FilterSetSchema extends MachineSchema {
  actions: ActionSchema<
    "applyDraft" | "clearFilters" | "resetDraft" | "setFilterValue"
  >
  computed: {
    /**
     * The selection the controls display: the draft in `manual` mode, the
     * committed value in `auto` mode.
     */
    draftValue: FilterSetValues
  }
  context: {
    draft: FilterSetDraft | null
    value: FilterSetValues
  }
  events:
    | {type: "APPLY"}
    | {type: "CLEAR_ALL"}
    | {type: "RESET"}
    | {
        id: string
        type: "FILTER.SET"
        value: ValueOrFn<unknown>
      }
  guards: {
    isAutoApply: () => boolean
  }
  props: RequiredBy<FilterSetApiProps, "applyMode" | "defaultValue">
  state: "idle"
}

export interface FilterSetApi<
  TDefs extends FilterDefinitions = FilterDefinitions,
> {
  /**
   * Commits the draft. No-op in `auto` mode.
   */
  apply: () => void

  /**
   * Controls when filter changes are committed.
   */
  applyMode: FilterSetApplyMode

  /**
   * Removes every filter. In `manual` mode this clears the draft and must be
   * applied; in `auto` mode it clears the committed filters immediately.
   */
  clearAll: () => void

  /**
   * Removes one filter. Follows the same commit rules as `clearAll`.
   */
  clearFilter: (id: keyof TDefs & string) => void

  /**
   * The selection the controls display. In `manual` mode, this is the draft,
   * which `apply` commits to `value`. In `auto` mode, it is always equal to
   * `value`.
   */
  draftValue: FilterValues<TDefs>

  /**
   * The total number of selected values in `draftValue`. Each array item
   * counts once. Ranges, dates, and text count 1.
   */
  draftValueCount: number

  /**
   * The filter definitions, from the `filters` prop.
   */
  filters: TDefs | undefined

  /**
   * Returns a filter's value in `draftValue`, or `undefined` when it is not
   * set.
   */
  getDraftValue: <K extends keyof TDefs & string>(
    id: K,
  ) => FilterValues<TDefs>[K]

  /**
   * Returns how many values a filter has in `draftValue`. Each array item
   * counts once. Ranges, dates, and text count 1.
   */
  getDraftValueCount: (id: keyof TDefs & string) => number

  /**
   * Returns the collection of a list or tree filter: the definition's
   * collection, otherwise the result of `getFilterCollection`. Returns
   * `undefined` for other filter kinds, and when the filter has neither.
   */
  getFilterCollection: (
    id: keyof TDefs & string,
  ) => FilterSetCollection | undefined

  /**
   * Returns the label for a filter. Resolves from the definition, then
   * `getFilterLabel`, then the id.
   */
  getFilterLabel: (id: keyof TDefs & string) => string

  /**
   * Returns the result count of each option in a filter from
   * `getFilterOptionCounts`, for the selection in `draftValue`. Returns
   * `undefined` when the filter has no counts.
   */
  getFilterOptionCounts: (
    id: keyof TDefs & string,
  ) => FilterSetOptionCounts | undefined

  /**
   * Returns the bounds of a range filter from its definition, then
   * `getFilterRange`.
   */
  getFilterRange: (id: keyof TDefs & string) => Partial<FilterSetRange>

  /**
   * Returns how many values a filter has in `value`. Each array item counts
   * once. Ranges, dates, and text count 1.
   */
  getValueCount: (id: keyof TDefs & string) => number

  /**
   * Returns one item per selected value of a filter in `value`, for active
   * filter chips. List and tree filters return one item per option, labeled by
   * the filter's collection, or by the value itself when the collection
   * doesn't contain it. Range, date, and text filters return one item for the
   * whole value.
   */
  getValueItems: (id: keyof TDefs & string) => FilterValueItem[]

  /**
   * Whether `draftValue` differs from `value`. Always `false` in `auto` mode.
   */
  isDirty: boolean

  /**
   * Whether a filter has a non-empty value in `draftValue`.
   */
  isFilterActive: (id: keyof TDefs & string) => boolean

  /**
   * Removes one of a filter's values, given the `value` of an item from
   * `getValueItems`. Range, date, and text filters are cleared.
   */
  removeFilterValue: (id: keyof TDefs & string, value: string) => void

  /**
   * Discards the draft and restores the committed filters. No-op in `auto`
   * mode.
   */
  reset: () => void

  /**
   * Sets the value of a filter. Empty values remove the filter.
   */
  setFilterValue: <K extends keyof TDefs & string>(
    id: K,
    value: ValueOrFn<FilterValues<TDefs>[K]>,
  ) => void

  /**
   * The committed selection.
   */
  value: FilterValues<TDefs>

  /**
   * The total number of selected values in `value`. Each array item counts
   * once; ranges, dates, and text count 1. Equal to `draftValueCount` in
   * `auto` mode.
   */
  valueCount: number
}
