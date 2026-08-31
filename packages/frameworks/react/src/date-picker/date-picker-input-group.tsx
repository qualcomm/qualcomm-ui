// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useId} from "react"

import type {DatePickerApiInputProps} from "@qualcomm-ui/core/date-picker"
import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {DatePickerErrorIndicator} from "./date-picker-error-indicator.js"
import {DatePickerInputClearTrigger} from "./date-picker-input-clear-trigger.js"
import {DatePickerInputIcon} from "./date-picker-input-icon.js"
import {DatePickerInputTrigger} from "./date-picker-input-trigger.js"
import {DatePickerInput} from "./date-picker-input.js"
import {DatePickerLabel} from "./date-picker-label.js"
import {DatePickerValueTags} from "./date-picker-value-tags.js"
import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerInputGroupProps extends Pick<
  DatePickerApiInputProps,
  "fixOnBlur"
> {
  /**
   * Returns the accessible label for a tag's remove button.
   * Only applicable in `multiple` mode.
   *
   * @default (dateText) => `Remove ${dateText}`
   */
  dismissLabel?: (dateText: string) => string

  /**
   * Label text rendered above the field.
   */
  label?: string

  /**
   * Text shown when no date is selected. Only applicable in `multiple` mode.
   *
   * @default 'Select dates'
   */
  placeholder?: string

  /**
   * Character shown between the start and end inputs of a range picker.
   *
   * @default '-'
   */
  separator?: string
}

/**
 * Groups the label, input, clear, and calendar trigger. For a range picker the
 * start and end inputs are grouped into a single bordered field separated by
 * {@link separator}.
 */
export function DatePickerInputGroup({
  dismissLabel,
  fixOnBlur,
  label,
  placeholder,
  separator = "-",
}: DatePickerInputGroupProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {getInputGroupBindings, getInputGroupTriggerBindings, selectionMode} =
    useDatePickerContext()
  const isRange = selectionMode === "range"
  const isMultiple = selectionMode === "multiple"
  const labelId = useId()
  const triggerId = useControlledId()
  const onDestroy = useOnDestroy()
  const hasGroupLabel = (isRange || isMultiple) && !!label
  const mergedProps = mergeProps(
    getInputGroupBindings(),
    isMultiple ? getInputGroupTriggerBindings({id: triggerId, onDestroy}) : {},
    qdsContext.getInputGroupBindings(),
    {
      "aria-labelledby": hasGroupLabel ? labelId : undefined,
      ...(hasGroupLabel && !isMultiple ? {role: "group"} : {}),
    },
  )

  return (
    <div {...qdsContext.getControlGroupBindings()}>
      {label && <DatePickerLabel id={labelId}>{label}</DatePickerLabel>}
      <div {...mergedProps}>
        {isMultiple ? (
          <DatePickerValueTags
            dismissLabel={dismissLabel}
            placeholder={placeholder}
          />
        ) : (
          <>
            <DatePickerInput fixOnBlur={fixOnBlur} index={0} />
            {isRange && (
              <>
                <span aria-hidden {...qdsContext.getRangeSeparatorBindings()}>
                  {separator}
                </span>
                <DatePickerInput fixOnBlur={fixOnBlur} index={1} />
              </>
            )}
          </>
        )}
        <DatePickerInputClearTrigger />
        <span aria-hidden {...qdsContext.getDividerBindings()} />
        <DatePickerErrorIndicator />
        {isMultiple ? <DatePickerInputIcon /> : <DatePickerInputTrigger />}
      </div>
    </div>
  )
}
