// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  ListCollection,
  TreeCollection,
} from "@qualcomm-ui/utils/collection"
import type {DateRangePreset} from "@qualcomm-ui/utils/date-utils"

/**
 * The item shape that list collections read by default, and that the table and
 * facet helpers produce.
 */
export interface FilterOptionObject {
  /**
   * Whether the option is disabled.
   */
  disabled?: boolean | undefined

  /**
   * Human-readable label for the option.
   */
  label: string

  /**
   * The value written to the filter when the option is selected.
   */
  value: string
}

/**
 * The selected item values. Single-select widgets write a one-item array so
 * that every list widget shares the same value shape.
 */
export type ListFilterValue = string[]

/**
 * The checked leaf values. Branch values are never stored.
 */
export type TreeFilterValue = string[]

/**
 * `[min, max]`. `null` leaves that side unbounded.
 */
export type RangeFilterValue = [number | null, number | null]

/**
 * `[start, end]` as ISO 8601 strings. `null` leaves that side unbounded.
 */
export type DateFilterRange = [string | null, string | null]

export type DateFilterValue = {preset: string} | {range: DateFilterRange}

export type TextFilterValue = string

/**
 * `[start, end]` returned by a preset's `range`. `null` leaves that side
 * unbounded.
 */
export type DateFilterPresetRange = [Date | string | null, Date | string | null]

/**
 * A preset named after one of the date picker's range presets, such as
 * `"last7Days"`. Its range is computed from the name.
 */
export interface BuiltInDateFilterPreset {
  /**
   * Human-readable label for the preset.
   */
  label: string

  range?: undefined

  /**
   * The date picker range preset. Also the value written to the filter when
   * the preset is selected.
   */
  value: DateRangePreset
}

export interface CustomDateFilterPreset {
  /**
   * Human-readable label for the preset.
   */
  label: string

  /**
   * Returns the `[start, end]` range for the preset. Called when filtering
   * runs, so relative presets stay relative to the current date.
   */
  range: () => DateFilterPresetRange

  /**
   * The value written to the filter when the preset is selected.
   */
  value: string
}

export type DateFilterPreset = BuiltInDateFilterPreset | CustomDateFilterPreset

interface FilterDefinitionConfig {
  /**
   * Human-readable label for the filter. Used by the filter section, active
   * filter summaries, and the control's accessible name.
   */
  label?: string | undefined
}

export interface ListFilterConfig<T = any> extends FilterDefinitionConfig {
  /**
   * The items to choose from. Their values are written to the filter, and their
   * labels label the selection everywhere, including active filter chips. Omit
   * to resolve the collection from the filter set's `getFilterCollection`, for
   * data that loads asynchronously or depends on other state.
   */
  collection?: ListCollection<T> | undefined
}

export interface TreeFilterConfig<T = any> extends FilterDefinitionConfig {
  /**
   * The tree to choose from. Checked leaf values are written to the filter, and
   * node labels label the selection everywhere, including active filter chips.
   * Omit to resolve the collection from the filter set's `getFilterCollection`.
   */
  collection?: TreeCollection<T> | undefined
}

export interface RangeFilterConfig extends FilterDefinitionConfig {
  /**
   * Formats a bound for display in active filter summaries.
   *
   * @default String
   */
  formatValue?: ((value: number) => string) | undefined

  /**
   * The upper bound of the range control.
   */
  max?: number | undefined

  /**
   * The lower bound of the range control.
   */
  min?: number | undefined
}

export interface DateFilterConfig extends FilterDefinitionConfig {
  /**
   * Formats an ISO 8601 date for display in active filter summaries.
   *
   * @default the ISO string
   */
  formatDate?: ((value: string) => string) | undefined

  /**
   * Developer-defined presets, such as "Last 7 days". A preset whose value is
   * a date picker range preset, such as `"last7Days"`, needs no `range`. The
   * selection stores the preset's value. Resolve it to dates with
   * `resolveDateFilterPreset`.
   */
  presets?: DateFilterPreset[] | undefined
}

/**
 * One selected value of a filter, with its label.
 */
export interface FilterValueItem {
  label: string

  /**
   * The selected option for list and tree filters. Range, date, and text
   * filters have one item for the whole value.
   */
  value: string
}

export interface CustomFilterConfig<TValue> extends FilterDefinitionConfig {
  /**
   * Returns how many values the filter contributes to the active filter count.
   *
   * Defaults to 1 for any non-empty value, or the array length for arrays.
   */
  getValueCount?: ((value: TValue) => number) | undefined

  /**
   * Returns one item per selected value, for active filter chips. For array
   * values, use each element's string form as the item's `value` so
   * `removeFilterValue` can remove it.
   *
   * Defaults to one item per array element, otherwise one item for the value.
   */
  getValueItems?: ((value: TValue) => FilterValueItem[]) | undefined

  /**
   * Returns `true` when the value should be treated as empty and removed.
   * Applied after the built-in check for `undefined`, `null`, `""`, and `[]`.
   */
  isEmptyValue?: ((value: TValue) => boolean) | undefined
}

interface FilterDefinitionBase<TKind extends string> {
  /**
   * Ties the definition to one filter component and one value type.
   */
  readonly kind: TKind
}

export interface ListFilterDefinition<T = any>
  extends FilterDefinitionBase<"list">, ListFilterConfig<T> {}

export interface TreeFilterDefinition<T = any>
  extends FilterDefinitionBase<"tree">, TreeFilterConfig<T> {}

export interface RangeFilterDefinition
  extends FilterDefinitionBase<"range">, RangeFilterConfig {}

export interface DateFilterDefinition
  extends FilterDefinitionBase<"date">, DateFilterConfig {}

export interface TextFilterDefinition
  extends FilterDefinitionBase<"text">, FilterDefinitionConfig {}

export interface CustomFilterDefinition<TValue = unknown>
  extends FilterDefinitionBase<"custom">, CustomFilterConfig<TValue> {}

export type FilterDefinition =
  | CustomFilterDefinition<any>
  | DateFilterDefinition
  | ListFilterDefinition
  | RangeFilterDefinition
  | TextFilterDefinition
  | TreeFilterDefinition

export type FilterKind = FilterDefinition["kind"]

/**
 * Filter definitions without ids, as passed to `defineFilters`.
 */
export type FilterDefinitionMap = Record<string, FilterDefinition>

/**
 * A definition returned by `defineFilters`, carrying its id.
 */
export type IdentifiedFilterDefinition<
  TDef extends FilterDefinition = FilterDefinition,
> = TDef & {readonly id: string}

export type FilterDefinitions<
  TMap extends FilterDefinitionMap = FilterDefinitionMap,
> = {
  readonly [K in keyof TMap & string]: IdentifiedFilterDefinition<TMap[K]>
}

interface FilterValueByKind {
  date: DateFilterValue
  list: ListFilterValue
  range: RangeFilterValue
  text: TextFilterValue
  tree: TreeFilterValue
}

export type FilterDefinitionValue<TDef> =
  TDef extends CustomFilterDefinition<infer TValue>
    ? TValue
    : TDef extends {
          readonly kind: infer TKind extends keyof FilterValueByKind
        }
      ? FilterValueByKind[TKind]
      : unknown

/**
 * The filter values for a set of definitions. Every filter is optional: an
 * empty filter is an absent key.
 */
export type FilterValues<TDefs> = {
  -readonly [K in keyof TDefs]?: FilterDefinitionValue<TDefs[K]>
}

/**
 * A filter that selects items from a list collection. Works with every list
 * widget, and the widget decides whether one or many values can be selected.
 * Single-select widgets write a one-item array.
 */
export function listFilter<T = any>(
  config: ListFilterConfig<T> = {},
): ListFilterDefinition<T> {
  return {...config, kind: "list"}
}

/**
 * A filter that selects the leaves of a tree collection. Checking a branch
 * selects its leaves, and only leaf values are stored.
 */
export function treeFilter<T = any>(
  config: TreeFilterConfig<T> = {},
): TreeFilterDefinition<T> {
  return {...config, kind: "tree"}
}

/**
 * Whether a definition selects from a collection: a list or tree filter.
 */
export function isCollectionFilter(
  definition: FilterDefinition | undefined,
): definition is ListFilterDefinition | TreeFilterDefinition {
  return definition?.kind === "list" || definition?.kind === "tree"
}

export function rangeFilter(
  config: RangeFilterConfig = {},
): RangeFilterDefinition {
  return {...config, kind: "range"}
}

export function dateFilter(
  config: DateFilterConfig = {},
): DateFilterDefinition {
  return {...config, kind: "date"}
}

export function textFilter(
  config: FilterDefinitionConfig = {},
): TextFilterDefinition {
  return {...config, kind: "text"}
}

export function customFilter<TValue>(
  config: CustomFilterConfig<TValue> = {},
): CustomFilterDefinition<TValue> {
  return {...config, kind: "custom"}
}

/**
 * Declares the filters of a filter panel. The object's keys are the filter
 * ids. Pass each returned definition to its filter component, and the whole
 * object to the panel's `filters` prop.
 */
export function defineFilters<TMap extends FilterDefinitionMap>(
  definitions: TMap,
): FilterDefinitions<TMap> {
  return Object.fromEntries(
    Object.entries(definitions).map(([id, definition]) => [
      id,
      {...definition, id},
    ]),
  ) as unknown as FilterDefinitions<TMap>
}
