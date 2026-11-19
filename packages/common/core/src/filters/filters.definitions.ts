// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DateRangePreset} from "@qualcomm-ui/utils/date-utils"

/**
 * A filter option. A plain string is used as both the value and the label.
 */
export type FilterOption = string | FilterOptionObject

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
 * Converts a string option to an option object.
 */
export function normalizeFilterOption(
  option: FilterOption,
): FilterOptionObject {
  return typeof option === "string" ? {label: option, value: option} : option
}

/**
 * The selected option values. Single-select widgets write a one-item array so
 * that every option widget shares the same value shape. The tree widget stores
 * only checked leaf values, never branch values.
 */
export type OptionFilterValue = string[]

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

export interface OptionFilterConfig extends FilterDefinitionConfig {
  /**
   * Returns the label for a selected value. Used outside the filter panel,
   * such as in active filter chips, when the option is not available.
   */
  getOptionLabel?: ((value: string) => string | undefined) | undefined

  /**
   * Static options. Options passed to the filter component take precedence.
   */
  options?: FilterOption[] | undefined
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

export interface CustomFilterConfig<TValue> extends FilterDefinitionConfig {
  /**
   * Returns how many values the filter contributes to the active filter count.
   *
   * Defaults to 1 for any non-empty value, or the array length for arrays.
   */
  getValueCount?: ((value: TValue) => number) | undefined

  /**
   * Returns the labels used to summarize the value outside the panel.
   *
   * Defaults to one label per array item, otherwise one label for the value
   */
  getValueLabels?: ((value: TValue) => string[]) | undefined

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

export interface OptionFilterDefinition
  extends FilterDefinitionBase<"option">, OptionFilterConfig {}

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
  | OptionFilterDefinition
  | RangeFilterDefinition
  | TextFilterDefinition

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
  option: OptionFilterValue
  range: RangeFilterValue
  text: TextFilterValue
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
 * A filter that selects from a list of options. Works with every option
 * widget, and the widget decides whether one or many values can be selected.
 * Single-select widgets write a one-item array. The tree widget takes its
 * nodes from its own `collection` prop and ignores `options`.
 */
export function optionFilter(
  config: OptionFilterConfig = {},
): OptionFilterDefinition {
  return {...config, kind: "option"}
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
