// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useState} from "react"

import {createDateFilterApi} from "@qualcomm-ui/core/filter-control"
import type {DateFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {DatePicker, type DatePickerProps} from "@qualcomm-ui/react/date-picker"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface DateFilterProps extends Omit<
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
 * A date range picker, optionally preceded by a radio group of the
 * definition's presets. Writes `{range: [start, end]}` with ISO 8601 dates, or
 * `{preset}`. Resolve a preset to dates with `resolveDateFilterPreset`.
 */
export function DateFilter({
  anyLabel,
  customRange,
  customRangeLabel,
  ...props
}: DateFilterProps): ReactElement {
  const [customSelected, setCustomSelected] = useState(false)
  const api = createDateFilterApi(useFilter<DateFilterDefinition>(), {
    anyLabel,
    customRange,
    customRangeLabel,
    customSelected,
    onCustomSelectedChange: setCustomSelected,
  })
  const qdsContext = useQdsFilterControlContext()

  const picker = api.showPicker ? (
    <DatePicker
      onValueChange={(details) => api.setPickerValue(details.value)}
      selectionMode="range"
      size={qdsContext.size}
      value={api.pickerValue}
      {...props}
    />
  ) : null

  if (!api.choices.length) {
    return <>{picker}</>
  }

  return (
    <>
      <RadioGroup
        {...api.getLabelProps()}
        {...qdsContext.getOptionGroupBindings()}
        onValueChange={api.selectChoice}
        size={qdsContext.size}
        value={api.choice}
      >
        {api.choices.map((choice) => (
          <Radio key={choice.value} label={choice.label} value={choice.value} />
        ))}
      </RadioGroup>
      {picker}
    </>
  )
}
