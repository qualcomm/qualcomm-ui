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
 * The state of a filter's collection, returned by `getFilterCollection`.
 * A filter's collection is `success` when it comes from its definition.
 */
export type FilterSetCollectionState =
  | {
      /**
       * The previous collection, shown while a refetch is in flight.
       */
      collection?: FilterSetCollection | undefined
      status: "loading"
    }
  | {
      /**
       * The previous collection, shown alongside the error.
       */
      collection?: FilterSetCollection | undefined
      error: unknown
      /**
       * Retries the request. Filter controls show a retry button when set.
       */
      retry?: (() => void) | undefined
      status: "error"
    }
  | {
      collection: FilterSetCollection
      status: "success"
    }

export interface FilterSetCollectionDetails {
  /**
   * The selected values the filter set can't label yet, because it hasn't seen
   * their items in a collection: typically values restored from the URL,
   * storage, or a controlled `value`. Include their items in the returned
   * collection, for example by fetching them by id.
   */
  values: string[]
}

/**
 * An item of a list filter, normalized for rendering.
 */
export interface FilterSetOption {
  /**
   * The item's result count from `getFilterOptionCounts`.
   */
  count?: number | undefined

  /**
   * Whether the item is disabled, either by the collection or because it is
   * unselected with a result count of 0.
   */
  disabled: boolean

  label: string

  value: string
}

/**
 * An item seen in a filter's collection for a selected value.
 */
export interface FilterSetCapturedItem {
  item: unknown
  label: string
}

/**
 * Result counts keyed by option value.
 */
export type FilterSetOptionCounts = Map<string, number> | Record<string, number>

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
   * such as with a query library, and return its state. The returned collection
   * must include the items of `details.values`. Return `undefined` for filters
   * this resolver doesn't handle.
   */
  getFilterCollection?:
    | ((
        id: string,
        details: FilterSetCollectionDetails,
      ) => FilterSetCollectionState | undefined)
    | undefined

  /**
   * Resolves a filter's label when its definition has none. Return `undefined`
   * to fall back to the filter id.
   */
  getFilterLabel?: ((id: string) => string | undefined) | undefined

  /**
   * Resolves the result count of each option in a filter, keyed by option
   * value. Called with the selection the controls display, so counts follow
   * the draft in `manual` mode. Unselected options with a count of 0 are
   * disabled. Return `undefined` to show no counts for the filter.
   */
  getFilterOptionCounts?:
    | ((
        id: string,
        values: FilterSetValues,
      ) => FilterSetOptionCounts | undefined)
    | undefined

  /**
   * Resolves the bounds of a range filter when its definition has none.
   */
  getFilterRange?: ((id: string) => FilterSetRange | undefined) | undefined

  /**
   * Additional check for empty filter values, applied after the built-in check
   * for `undefined`, `null`, `""`, `[]`, and unbounded ranges. Empty values
   * remove the filter.
   */
  isEmptyValue?: ((id: string, value: unknown) => boolean) | undefined

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
    | "applyDraft"
    | "captureItems"
    | "clearFilters"
    | "resetDraft"
    | "setFilterValue"
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
  refs: {
    /**
     * Items seen in a collection for selected values, keyed by filter id, then
     * by value. Keeps a selection labeled after its collection changes, such as
     * when a server-side search narrows it.
     */
    items: Record<string, Record<string, FilterSetCapturedItem>>
    /**
     * The last options returned for each filter, so `getFilterOptions` keeps
     * returning the same array while the options are unchanged.
     */
    options: Record<string, FilterSetOption[]>
  }
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
   * counts once; ranges, dates, and text count 1.
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
   * Returns the state of a list or tree filter's collection: `success` with
   * the definition's collection, otherwise the result of
   * `getFilterCollection`. Returns `undefined` when the filter has neither.
   */
  getFilterCollectionState: (id: string) => FilterSetCollectionState | undefined

  /**
   * Returns the label for a filter. Resolves from the definition, then
   * `getFilterLabel`, then the id.
   */
  getFilterLabel: (id: string) => string

  /**
   * Returns the result count of an option from `getFilterOptionCounts`, or
   * `undefined` when the filter has no counts. Options missing from the
   * filter's counts count 0.
   */
  getFilterOptionCount: (id: string, value: string) => number | undefined

  /**
   * Returns the label for a value of a list or tree filter. Resolves from the
   * current collection, then the item last seen for the value, then the value
   * itself.
   */
  getFilterOptionLabel: (id: string, value: string) => string

  /**
   * Returns the items of a list filter, normalized for rendering, with counts
   * from `getFilterOptionCounts`. Selected values missing from the collection
   * are appended so they can be deselected. Empty while the collection loads
   * for the first time. Returns the same array while the options are
   * unchanged, so it can be used as a memo dependency.
   */
  getFilterOptions: (id: string) => FilterSetOption[]

  /**
   * Returns the bounds of a range filter from its definition, then
   * `getFilterRange`.
   */
  getFilterRange: (id: string) => Partial<FilterSetRange>

  /**
   * Returns how many values a filter has in `value`. Each array item counts
   * once. Ranges, dates, and text count 1.
   */
  getValueCount: (id: keyof TDefs & string) => number

  /**
   * Returns one item per selected value of a filter in `value`, for active
   * filter chips. List and tree filters return one item per option. Range,
   * date, and text filters return one item for the whole value.
   */
  getValueItems: (id: keyof TDefs & string) => FilterValueItem[]

  /**
   * Whether `draftValue` differs from `value`. Always `false` in `auto` mode.
   */
  isDirty: boolean

  /**
   * Whether a filter has a non-empty value in `draftValue`.
   */
  isFilterActive: (id: string) => boolean

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
