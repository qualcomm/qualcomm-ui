// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useState} from "react"

import type {
  DateFilterDefinition,
  DateFilterRange,
} from "@qualcomm-ui/core/filters"
import {useFilterPanelFilter} from "@qualcomm-ui/react-core/filter-panel"
import {
  DatePicker,
  type DatePickerProps,
  type DateValue,
  parseDate,
} from "@qualcomm-ui/react/date-picker"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"

const ANY = ""
const CUSTOM = "~custom"

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

export interface DateFilterControlProps extends Omit<
  DatePickerProps,
  "defaultValue" | "onValueChange" | "selectionMode" | "value"
> {
  /**
   * Label of the option that clears the filter. Only rendered with presets.
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
   * Label of the custom range option. Only rendered with presets.
   *
   * @default "Custom range"
   */
  customRangeLabel?: string | undefined
}

/**
 * A date range picker, optionally preceded by the definition's presets.
 */
export function DateFilterControl({
  anyLabel = "Any time",
  customRange = true,
  customRangeLabel = "Custom range",
  ...props
}: DateFilterControlProps): ReactElement {
  const filter = useFilterPanelFilter<DateFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
  const [customSelected, setCustomSelected] = useState(false)

  const value = filter.value
  const presets = filter.definition.presets ?? []
  const range: DateFilterRange =
    value && "range" in value ? value.range : [null, null]
  const isCustom = (!!value && "range" in value) || customSelected

  const picker = (
    <DatePicker
      onValueChange={(details) =>
        filter.setValue({
          range: [
            details.value[0]?.toString() ?? null,
            details.value[1]?.toString() ?? null,
          ],
        })
      }
      selectionMode="range"
      size={qdsContext.controlSize}
      value={range
        .map(toDateValue)
        .filter((date): date is DateValue => date !== null)}
      {...props}
    />
  )

  if (!presets.length) {
    return picker
  }

  return (
    <>
      <RadioGroup
        aria-labelledby={filter.labelId}
        {...qdsContext.getOptionGroupBindings()}
        onValueChange={(next) => {
          setCustomSelected(next === CUSTOM)
          filter.setValue(
            !next || next === ANY || next === CUSTOM
              ? undefined
              : {preset: next},
          )
        }}
        size={qdsContext.controlSize}
        value={
          value && "preset" in value ? value.preset : isCustom ? CUSTOM : ANY
        }
      >
        <Radio label={anyLabel} value={ANY} />
        {presets.map((preset) => (
          <Radio key={preset.value} label={preset.label} value={preset.value} />
        ))}
        {customRange ? <Radio label={customRangeLabel} value={CUSTOM} /> : null}
      </RadioGroup>
      {customRange && isCustom ? picker : null}
    </>
  )
}

export interface DateFilterProps
  extends
    FilterSectionProps<DateFilterDefinition>,
    Omit<DateFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that selects a date range, or one of the definition's presets.
 * Writes `{range: [start, end]}` with ISO 8601 dates, or `{preset}`. Resolve a
 * preset to dates with `resolveDateFilterPreset`.
 */
export function DateFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: DateFilterProps): ReactElement {
  return (
    <FilterSection
      contentProps={contentProps}
      defaultOpen={defaultOpen}
      filter={filter}
      label={label}
      onOpenChange={onOpenChange}
      open={open}
      rootProps={rootProps}
      triggerProps={triggerProps}
    >
      <DateFilterControl {...props} />
    </FilterSection>
  )
}
