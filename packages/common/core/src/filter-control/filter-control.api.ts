// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterSetOptionCounts,
  FilterState,
} from "@qualcomm-ui/core/filter-set"
import type {
  DateFilterDefinition,
  FilterKind,
  ListFilterDefinition,
  RangeFilterDefinition,
  TextFilterDefinition,
  TreeFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {ListCollection, TreeCollection} from "@qualcomm-ui/utils/collection"
import {type DateValue, parseDate} from "@qualcomm-ui/utils/date-utils"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"
import {warnOnce} from "@qualcomm-ui/utils/warning"

import type {
  CheckboxGroupFilterApi,
  CheckboxGroupFilterRootBindings,
  CheckboxTreeFilterApi,
  ComboboxFilterApi,
  DateFilterApi,
  DateFilterApiProps,
  DateFilterChoice,
  FilterControlLabelProps,
  FilterControlOption,
  RadioGroupFilterApi,
  RadioGroupFilterApiProps,
  SelectFilterApi,
  SliderFilterApi,
  SliderFilterApiProps,
  TextInputFilterApi,
  TextInputFilterApiProps,
} from "./filter-control.types.js"

/**
 * Names a control by the filter's label element when there is one, otherwise
 * by the filter's label text.
 */
export function getFilterControlLabelProps(
  filter: Pick<FilterState, "label" | "labelId">,
): FilterControlLabelProps {
  return filter.labelId
    ? {"aria-labelledby": filter.labelId}
    : {"aria-label": filter.label}
}

/**
 * Returns an option's result count, or `undefined` when the filter has no
 * counts. Options missing from the counts count 0. Own-property lookups keep
 * values such as `constructor` from matching inherited properties.
 */
export function getFilterOptionCount(
  counts: FilterSetOptionCounts | undefined,
  value: string,
): number | undefined {
  if (!counts) {
    return undefined
  }
  return Object.hasOwn(counts, value) ? counts[value] : 0
}

/**
 * Returns the items of a list collection whose text contains `inputValue`.
 * Returns the collection itself when `inputValue` is empty. Returns a new
 * collection otherwise, so callers that need a stable collection should
 * memoize the result.
 */
export function narrowFilterCollection<T>(
  collection: ListCollection<T>,
  inputValue: string,
  contains: (text: string, query: string) => boolean,
): ListCollection<T> {
  if (!inputValue) {
    return collection
  }
  return collection.copy(
    collection.items.filter((item) =>
      contains(collection.stringifyItem(item) ?? "", inputValue),
    ),
  )
}

/**
 * Warns in development when a control renders a filter of a kind it can't
 * write. Custom filters are always accepted.
 */
function warnKindMismatch(
  widget: string,
  kind: FilterKind,
  filter: FilterState<any>,
): void {
  const actualKind = filter.definition.kind
  if (actualKind !== kind && actualKind !== "custom") {
    warnOnce(
      `filter-control-kind-${widget}-${filter.id}`,
      `${widget} writes "${kind}" filters, but filter "${filter.id}" is a "${actualKind}" filter.`,
    )
  }
}

const emptyCollection = new ListCollection<any>({items: []})

function getListCollection(
  filter: FilterState<any>,
): ListCollection<any> | undefined {
  return filter.collection instanceof ListCollection
    ? filter.collection
    : undefined
}

function getListOptions(
  filter: FilterState<any>,
  collection: ListCollection<any>,
  isChecked: (value: string) => boolean,
): FilterControlOption[] {
  return collection.items.flatMap((item) => {
    const value = collection.getItemValue(item)
    if (value === null) {
      return []
    }
    const count = getFilterOptionCount(filter.optionCounts, value)
    const checked = isChecked(value)
    return {
      checked,
      count,
      disabled: !checked && (!!collection.getItemDisabled(item) || count === 0),
      label: collection.stringifyItem(item) ?? value,
      value,
    }
  })
}

export function createCheckboxGroupFilterApi(
  filter: FilterState<ListFilterDefinition>,
  normalize: PropNormalizer,
): CheckboxGroupFilterApi {
  warnKindMismatch("CheckboxGroupFilter", "list", filter)
  const collection = getListCollection(filter)
  const selected = filter.value ?? []

  return {
    getRootBindings(): CheckboxGroupFilterRootBindings {
      return normalize.element({
        ...getFilterControlLabelProps(filter),
        role: "group",
      })
    },
    options: collection
      ? getListOptions(filter, collection, (value) =>
          selected.includes(value),
        ).map((option) => ({
          ...option,
          setChecked(checked) {
            filter.setValue((prev = []) =>
              checked
                ? [...prev, option.value]
                : prev.filter((value) => value !== option.value),
            )
          },
        }))
      : undefined,
  }
}

const RADIO_ANY = ""

export function createRadioGroupFilterApi(
  filter: FilterState<ListFilterDefinition>,
  props: RadioGroupFilterApiProps = {},
): RadioGroupFilterApi {
  warnKindMismatch("RadioGroupFilter", "list", filter)
  const {anyLabel} = props
  const collection = getListCollection(filter)
  const selected = filter.value?.[0]

  function getOptions(collection: ListCollection<any>): FilterControlOption[] {
    const options = getListOptions(
      filter,
      collection,
      (value) => value === selected,
    )
    if (!anyLabel) {
      return options
    }
    return [
      {
        checked: selected === undefined,
        count: undefined,
        disabled: false,
        label: anyLabel,
        value: RADIO_ANY,
      },
      ...options,
    ]
  }

  return {
    getLabelProps: () => getFilterControlLabelProps(filter),
    options: collection ? getOptions(collection) : undefined,
    setValue(value) {
      filter.setValue(value ? [value] : undefined)
    },
    value: selected ?? (anyLabel ? RADIO_ANY : null),
  }
}

function createListSelectionApi(
  widget: string,
  filter: FilterState<ListFilterDefinition>,
): SelectFilterApi {
  warnKindMismatch(widget, "list", filter)
  return {
    collection: getListCollection(filter) ?? emptyCollection,
    getLabelProps: () => getFilterControlLabelProps(filter),
    setValue(value) {
      filter.setValue(value)
    },
    value: filter.value ?? [],
  }
}

export function createSelectFilterApi(
  filter: FilterState<ListFilterDefinition>,
): SelectFilterApi {
  return createListSelectionApi("SelectFilter", filter)
}

/**
 * Narrow the returned `collection` by the input text with
 * `narrowFilterCollection`.
 */
export function createComboboxFilterApi(
  filter: FilterState<ListFilterDefinition>,
): ComboboxFilterApi {
  return createListSelectionApi("ComboboxFilter", filter)
}

export function createCheckboxTreeFilterApi(
  filter: FilterState<TreeFilterDefinition>,
): CheckboxTreeFilterApi {
  warnKindMismatch("CheckboxTreeFilter", "tree", filter)
  return {
    checkedValue: filter.value ?? [],
    getLabelProps: () => getFilterControlLabelProps(filter),
    getOptionCount: (value) => getFilterOptionCount(filter.optionCounts, value),
    setCheckedValue(value) {
      filter.setValue(value)
    },
    tree:
      filter.collection instanceof TreeCollection
        ? filter.collection
        : undefined,
  }
}

const DATE_ANY = ""
const DATE_CUSTOM = "~custom"

function toDateValue(value: string | null): DateValue | null {
  if (!value) {
    return null
  }
  try {
    return parseDate(value.slice(0, 10))
  } catch {
    return null
  }
}

export function createDateFilterApi(
  filter: FilterState<DateFilterDefinition>,
  props: DateFilterApiProps,
): DateFilterApi {
  warnKindMismatch("DateFilter", "date", filter)
  const {
    anyLabel = "Any time",
    customRange = true,
    customRangeLabel = "Custom range",
    customSelected,
    onCustomSelectedChange,
  } = props
  const value = filter.value
  const presets = filter.definition.presets ?? []
  const hasRange = !!value && "range" in value
  const range = hasRange ? value.range : [null, null]
  const isCustom = hasRange || customSelected

  const choices: DateFilterChoice[] = presets.length
    ? [
        {label: anyLabel, value: DATE_ANY},
        ...presets.map(({label, value}) => ({label, value})),
        ...(customRange ? [{label: customRangeLabel, value: DATE_CUSTOM}] : []),
      ]
    : []

  return {
    choice:
      value && "preset" in value
        ? value.preset
        : isCustom
          ? DATE_CUSTOM
          : DATE_ANY,
    choices,
    getLabelProps: () => getFilterControlLabelProps(filter),
    pickerValue: range
      .map(toDateValue)
      .filter((date): date is DateValue => date !== null),
    selectChoice(next) {
      onCustomSelectedChange(next === DATE_CUSTOM)
      filter.setValue(
        !next || next === DATE_ANY || next === DATE_CUSTOM
          ? undefined
          : {preset: next},
      )
    },
    setPickerValue(next) {
      filter.setValue({
        range: [next[0]?.toString() ?? null, next[1]?.toString() ?? null],
      })
    },
    showPicker: !presets.length || (customRange && isCustom),
  }
}

const SLIDER_DEFAULT_MIN = 0
const SLIDER_DEFAULT_MAX = 100

export function createSliderFilterApi(
  filter: FilterState<RangeFilterDefinition>,
  props: SliderFilterApiProps,
): SliderFilterApi {
  warnKindMismatch("SliderFilter", "range", filter)
  const min = props.range.min ?? SLIDER_DEFAULT_MIN
  const max = props.range.max ?? SLIDER_DEFAULT_MAX

  return {
    commit(next) {
      filter.setValue([
        next[0] <= min ? null : next[0],
        next[1] >= max ? null : next[1],
      ])
    },
    disabled: min === max,
    getThumbLabelProps() {
      return filter.labelId
        ? {"aria-labelledby": [filter.labelId, filter.labelId]}
        : {"aria-label": [filter.label, filter.label]}
    },
    marks: [min, max],
    max,
    min,
    value: props.dragValue ?? [
      filter.value?.[0] ?? min,
      filter.value?.[1] ?? max,
    ],
  }
}

export function createTextInputFilterApi(
  filter: FilterState<TextFilterDefinition>,
  props: TextInputFilterApiProps,
): TextInputFilterApi {
  warnKindMismatch("TextInputFilter", "text", filter)
  const {applyMode, debounce = 300, pending} = props

  return {
    commitDelay: applyMode === "manual" ? 0 : debounce,
    getLabelProps: () => getFilterControlLabelProps(filter),
    setValue(value) {
      filter.setValue(value)
    },
    value: pending ?? filter.value ?? "",
  }
}
