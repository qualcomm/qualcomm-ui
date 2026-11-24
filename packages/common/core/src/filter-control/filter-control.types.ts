// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterSetApplyMode,
  FilterSetRange,
} from "@qualcomm-ui/core/filter-set"
import type {
  ListCollection,
  TreeCollection,
} from "@qualcomm-ui/utils/collection"
import type {DateValue} from "@qualcomm-ui/utils/date-utils"

/**
 * Names a control by the filter's label element when there is one, otherwise
 * by the filter's label text.
 */
export interface FilterControlLabelProps {
  "aria-label"?: string | undefined
  "aria-labelledby"?: string | undefined
}

/**
 * One option of a list filter's collection, resolved for a control.
 */
export interface FilterControlOption {
  /**
   * Whether the option is selected.
   */
  checked: boolean

  /**
   * The option's result count. `undefined` when the filter has no counts.
   */
  count: number | undefined

  /**
   * Whether the option can't be selected. Selected options are never
   * disabled, so they can always be cleared. Unselected options are disabled
   * when the collection disables them or when they have no results.
   */
  disabled: boolean

  label: string

  value: string
}

export interface CheckboxGroupFilterOption extends FilterControlOption {
  /**
   * Adds the option to the filter's value, or removes it.
   */
  setChecked: (checked: boolean) => void
}

export interface CheckboxGroupFilterRootBindings extends FilterControlLabelProps {
  role: "group"
}

export interface CheckboxGroupFilterApi {
  getRootBindings: () => CheckboxGroupFilterRootBindings

  /**
   * One option per item of the filter's list collection. `undefined` while
   * the filter has no list collection.
   */
  options: CheckboxGroupFilterOption[] | undefined
}

export interface RadioGroupFilterApiProps {
  /**
   * The label of a leading option that clears the filter, such as "Any".
   * Omit to list only the collection's items.
   */
  anyLabel?: string | undefined
}

export interface RadioGroupFilterApi {
  getLabelProps: () => FilterControlLabelProps

  /**
   * One option per item of the filter's list collection, preceded by the
   * clearing option when `anyLabel` is set. `undefined` while the filter has
   * no list collection.
   */
  options: FilterControlOption[] | undefined

  /**
   * Writes the selected option. An empty or `null` value clears the filter.
   */
  setValue: (value: string | null) => void

  /**
   * The value of the selected option. `null` when nothing is selected and
   * there is no clearing option.
   */
  value: string | null
}

export interface SelectFilterApi {
  /**
   * The filter's list collection, or an empty collection while it has none.
   */
  collection: ListCollection<any>

  getLabelProps: () => FilterControlLabelProps

  setValue: (value: string[]) => void

  value: string[]
}

export interface ComboboxFilterApi extends SelectFilterApi {}

export interface CheckboxTreeFilterApi {
  /**
   * The checked leaf values.
   */
  checkedValue: string[]

  getLabelProps: () => FilterControlLabelProps

  /**
   * Returns a node's result count, or `undefined` when the filter has no
   * counts.
   */
  getOptionCount: (value: string) => number | undefined

  setCheckedValue: (value: string[]) => void

  /**
   * The filter's tree collection. `undefined` while the filter has none.
   */
  tree: TreeCollection<any> | undefined
}

export interface DateFilterApiProps {
  /**
   * Label of the choice that clears the filter. Only listed with presets.
   *
   * @default "Any time"
   */
  anyLabel?: string | undefined

  /**
   * Whether a custom range can be picked alongside the definition's presets.
   * Without presets, the filter is always a custom range.
   *
   * @default true
   */
  customRange?: boolean | undefined

  /**
   * Label of the custom range choice. Only listed with presets.
   *
   * @default "Custom range"
   */
  customRangeLabel?: string | undefined

  /**
   * Whether the user picked the custom range choice. Kept by the control,
   * since an empty custom range has no filter value to record it.
   */
  customSelected: boolean

  /**
   * Called when the user picks or leaves the custom range choice.
   */
  onCustomSelectedChange: (customSelected: boolean) => void
}

export interface DateFilterChoice {
  label: string
  value: string
}

export interface DateFilterApi {
  /**
   * The value of the selected choice.
   */
  choice: string

  /**
   * The clearing choice, the definition's presets, and the custom range
   * choice. Empty when the definition has no presets.
   */
  choices: DateFilterChoice[]

  getLabelProps: () => FilterControlLabelProps

  /**
   * The bounds of the custom range, for the date picker.
   */
  pickerValue: DateValue[]

  /**
   * Writes a choice. The clearing and custom range choices clear the filter.
   */
  selectChoice: (value: string | null) => void

  /**
   * Writes a custom range from the date picker's value.
   */
  setPickerValue: (value: Array<DateValue | null | undefined>) => void

  /**
   * Whether the date picker is shown.
   */
  showPicker: boolean
}

export interface SliderFilterApiProps {
  /**
   * The thumb positions while the user drags, before they're committed.
   * `null` when the user isn't dragging.
   */
  dragValue: number[] | null

  /**
   * The filter's bounds, from the filter set's `getFilterRange`.
   */
  range: Partial<FilterSetRange>
}

/**
 * Each thumb reads its accessible name from the array entry at its index.
 */
export interface SliderFilterThumbLabelProps {
  "aria-label"?: string[] | undefined
  "aria-labelledby"?: string[] | undefined
}

export interface SliderFilterApi {
  /**
   * Writes the thumb positions. A thumb resting on its bound leaves that side
   * unbounded.
   */
  commit: (value: number[]) => void

  /**
   * Whether the bounds are equal, leaving no range to narrow.
   */
  disabled: boolean

  getThumbLabelProps: () => SliderFilterThumbLabelProps

  /**
   * The bounds. Bounds that come from data are arbitrary, so evenly spaced
   * marks between them land on fractional values and overlap in narrow
   * containers.
   */
  marks: number[]

  max: number

  min: number

  /**
   * The thumb positions.
   */
  value: number[]
}

export interface TextInputFilterApiProps {
  /**
   * The filter set's apply mode.
   */
  applyMode: FilterSetApplyMode

  /**
   * Milliseconds to wait after typing stops before committing in `auto`
   * apply mode.
   *
   * @default 300
   */
  debounce?: number | undefined

  /**
   * The typed text not yet committed. `null` when nothing is pending.
   */
  pending: string | null
}

export interface TextInputFilterApi {
  /**
   * Milliseconds to wait before calling `setValue` with typed text. `0` means
   * commit immediately, which is always the case in `manual` mode.
   */
  commitDelay: number

  getLabelProps: () => FilterControlLabelProps

  setValue: (value: string) => void

  /**
   * The input's text.
   */
  value: string
}
