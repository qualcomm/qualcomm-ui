// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {
  DatePickerApiProps,
  DatePickerApiDayTableCellProps,
  DatePickerApiInputProps,
  DatePickerApiLabelProps,
  DatePickerApiPresetTriggerProps,
  DatePickerApiTableCellProps,
  DatePickerApiTableProps,
  DatePickerApiViewProps,
} from "./date-picker.types.js"

const datePickerProps: (keyof DatePickerApiProps)[] =
  createProps<DatePickerApiProps>()(
    "closeOnSelect",
    "createCalendar",
    "dir",
    "disabled",
    "fixedWeeks",
    "focusedValue",
    "format",
    "parse",
    "placeholder",
    "inline",
    "invalid",
    "isDateUnavailable",
    "locale",
    "max",
    "maxSelectedDates",
    "min",
    "name",
    "numOfMonths",
    "onFocusChange",
    "onOpenChange",
    "onValueChange",
    "onViewChange",
    "onVisibleRangeChange",
    "open",
    "openOnClick",
    "defaultOpen",
    "positioning",
    "readOnly",
    "required",
    "selectionMode",
    "startOfWeek",
    "timeZone",
    "translations",
    "value",
    "defaultView",
    "defaultValue",
    "view",
    "defaultFocusedValue",
    "outsideDaySelectable",
    "viewOnSelect",
    "minView",
    "maxView",
  )
export const splitDatePickerProps: <Props extends DatePickerApiProps>(
  props: Props,
) => [DatePickerApiProps, Omit<Props, keyof DatePickerApiProps>] =
  createSplitProps<DatePickerApiProps>(datePickerProps)

const datePickerViewProps: (keyof DatePickerApiViewProps)[] =
  createProps<DatePickerApiViewProps>()("view")
export const splitDatePickerViewProps: <Props extends DatePickerApiViewProps>(
  props: Props,
) => [DatePickerApiViewProps, Omit<Props, keyof DatePickerApiViewProps>] =
  createSplitProps<DatePickerApiViewProps>(datePickerViewProps)

const datePickerTableProps: (keyof DatePickerApiTableProps)[] =
  createProps<DatePickerApiTableProps>()("columns", "view")
export const splitDatePickerTableProps: <Props extends DatePickerApiTableProps>(
  props: Props,
) => [DatePickerApiTableProps, Omit<Props, keyof DatePickerApiTableProps>] =
  createSplitProps<DatePickerApiTableProps>(datePickerTableProps)

type DatePickerTableCellProps = DatePickerApiDayTableCellProps &
  DatePickerApiTableCellProps
const datePickerTableCellProps: (keyof DatePickerTableCellProps)[] =
  createProps<DatePickerTableCellProps>()(
    "visibleRange",
    "columns",
    "disabled",
    "value",
  )
export const splitDatePickerTableCellProps: <
  Props extends DatePickerTableCellProps,
>(
  props: Props,
) => [DatePickerTableCellProps, Omit<Props, keyof DatePickerTableCellProps>] =
  createSplitProps<DatePickerTableCellProps>(datePickerTableCellProps)

const datePickerInputProps: (keyof DatePickerApiInputProps)[] =
  createProps<DatePickerApiInputProps>()("fixOnBlur", "index")
export const splitDatePickerInputProps: <Props extends DatePickerApiInputProps>(
  props: Props,
) => [DatePickerApiInputProps, Omit<Props, keyof DatePickerApiInputProps>] =
  createSplitProps<DatePickerApiInputProps>(datePickerInputProps)

const datePickerLabelProps: (keyof DatePickerApiLabelProps)[] =
  createProps<DatePickerApiLabelProps>()("index")
export const splitDatePickerLabelProps: <Props extends DatePickerApiLabelProps>(
  props: Props,
) => [DatePickerApiLabelProps, Omit<Props, keyof DatePickerApiLabelProps>] =
  createSplitProps<DatePickerApiLabelProps>(datePickerLabelProps)

const datePickerPresetTriggerProps: (keyof DatePickerApiPresetTriggerProps)[] =
  createProps<DatePickerApiPresetTriggerProps>()("value")
export const splitDatePickerPresetTriggerProps: <
  Props extends DatePickerApiPresetTriggerProps,
>(
  props: Props,
) => [
  DatePickerApiPresetTriggerProps,
  Omit<Props, keyof DatePickerApiPresetTriggerProps>,
] = createSplitProps<DatePickerApiPresetTriggerProps>(
  datePickerPresetTriggerProps,
)
