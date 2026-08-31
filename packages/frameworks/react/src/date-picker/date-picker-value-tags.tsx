// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useDatePickerContext} from "@qualcomm-ui/react-core/date-picker"
import {Tag} from "@qualcomm-ui/react/tag"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerValueTagsProps {
  /**
   * Returns the accessible label for a tag's remove button.
   *
   * @default (dateText) => `Remove ${dateText}`
   */
  dismissLabel?: (dateText: string) => string

  /**
   * Text shown when no date is selected.
   *
   * @default 'Select dates'
   */
  placeholder?: string
}

/**
 * Displays the dates selected in `multiple` mode as dismissible tags. Renders a
 * visually-hidden input per selected date so the selection participates in form
 * submission under the picker's `name`.
 */
export function DatePickerValueTags({
  dismissLabel = (dateText) => `Remove ${dateText}`,
  placeholder = "Select dates",
}: DatePickerValueTagsProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {
    disabled,
    getHiddenInputBindings,
    readOnly,
    toggleValue,
    value,
    valueAsString,
  } = useDatePickerContext()

  const tags = value.flatMap((date, index) =>
    // there shouldn't be any null in `multiple` so that's belt+suspenders
    date == null ? [] : [{date, label: valueAsString[index]}],
  )

  // An empty selection still needs one input so `required` blocks submission.
  const formValues = tags.length ? tags : [{label: ""}]
  const hiddenInputs = formValues.map((tag, index) => (
    <input key={index} {...getHiddenInputBindings({index, value: tag.label})} />
  ))

  if (tags.length === 0) {
    return (
      <span data-empty {...qdsContext.getValueTagsBindings()}>
        {placeholder}
        {hiddenInputs}
      </span>
    )
  }

  return (
    <span {...qdsContext.getValueTagsBindings()}>
      {tags.map(({date, label}) => (
        <Tag
          key={date.toString()}
          disabled={disabled || readOnly}
          dismissLabel={dismissLabel(label)}
          emphasis="neutral"
          // the field is the calendar trigger; tags must not toggle it
          onClick={(event) => event.stopPropagation()}
          onDismiss={() => toggleValue(date)}
          variant="dismissable"
        >
          {label}
        </Tag>
      ))}
      {hiddenInputs}
    </span>
  )
}
