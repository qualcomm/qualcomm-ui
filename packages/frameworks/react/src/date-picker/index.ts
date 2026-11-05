// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  DatePickerActions,
  type DatePickerActionsProps,
} from "./date-picker-actions.js"
import {
  DatePickerCancelTrigger,
  type DatePickerCancelTriggerProps,
} from "./date-picker-cancel-trigger.js"
import {
  DatePickerClearTrigger,
  type DatePickerClearTriggerProps,
} from "./date-picker-clear-trigger.js"
import {
  DatePickerContent,
  type DatePickerContentProps,
} from "./date-picker-content.js"
import {
  DatePickerContext,
  type DatePickerContextProps,
} from "./date-picker-context.js"
import {
  DatePickerControl,
  type DatePickerControlProps,
} from "./date-picker-control.js"
import {
  DatePickerDayGridHeader,
  type DatePickerDayGridHeaderProps,
} from "./date-picker-day-grid-header.js"
import {
  DatePickerDayGrid,
  type DatePickerDayGridProps,
} from "./date-picker-day-grid.js"
import {
  DatePickerErrorIndicator,
  type DatePickerErrorIndicatorProps,
} from "./date-picker-error-indicator.js"
import {
  DatePickerErrorText,
  type DatePickerErrorTextProps,
} from "./date-picker-error-text.js"
import {
  DatePickerHeadlineLabel,
  type DatePickerHeadlineLabelProps,
} from "./date-picker-headline-label.js"
import {
  DatePickerHeadlineValue,
  type DatePickerHeadlineValueProps,
} from "./date-picker-headline-value.js"
import {
  DatePickerHeadline,
  type DatePickerHeadlineProps,
} from "./date-picker-headline.js"
import {DatePickerHint, type DatePickerHintProps} from "./date-picker-hint.js"
import {
  DatePickerInputClearTrigger,
  type DatePickerInputClearTriggerProps,
} from "./date-picker-input-clear-trigger.js"
import {
  DatePickerInputGroup,
  type DatePickerInputGroupProps,
} from "./date-picker-input-group.js"
import {DatePickerInputIcon} from "./date-picker-input-icon.js"
import {
  DatePickerInputTrigger,
  type DatePickerInputTriggerProps,
} from "./date-picker-input-trigger.js"
import {
  DatePickerInput,
  type DatePickerInputProps,
} from "./date-picker-input.js"
import {
  DatePickerLabel,
  type DatePickerLabelProps,
} from "./date-picker-label.js"
import {
  DatePickerMonthGrid,
  type DatePickerMonthGridProps,
} from "./date-picker-month-grid.js"
import {
  DatePickerMonthText,
  type DatePickerMonthTextProps,
} from "./date-picker-month-text.js"
import {
  DatePickerNextTrigger,
  type DatePickerNextTriggerProps,
} from "./date-picker-next-trigger.js"
import {
  DatePickerOkTrigger,
  type DatePickerOkTriggerProps,
} from "./date-picker-ok-trigger.js"
import {
  DatePickerPositioner,
  type DatePickerPositionerProps,
} from "./date-picker-positioner.js"
import {
  DatePickerPresetTrigger,
  type DatePickerPresetTriggerProps,
} from "./date-picker-preset-trigger.js"
import {
  DatePickerPresetsTrigger,
  type DatePickerPresetsTriggerProps,
} from "./date-picker-presets-trigger.js"
import {
  DatePickerPresets,
  type DatePickerPresetsProps,
} from "./date-picker-presets.js"
import {
  DatePickerPrevTrigger,
  type DatePickerPrevTriggerProps,
} from "./date-picker-prev-trigger.js"
import {
  DatePickerRangeText,
  type DatePickerRangeTextProps,
} from "./date-picker-range-text.js"
import {DatePickerRoot, type DatePickerRootProps} from "./date-picker-root.js"
import {
  DatePickerTableBody,
  type DatePickerTableBodyProps,
} from "./date-picker-table-body.js"
import {
  DatePickerTableCellTrigger,
  type DatePickerTableCellTriggerProps,
} from "./date-picker-table-cell-trigger.js"
import {
  DatePickerTableCell,
  type DatePickerTableCellProps,
} from "./date-picker-table-cell.js"
import {
  DatePickerTableHead,
  type DatePickerTableHeadProps,
} from "./date-picker-table-head.js"
import {
  DatePickerTableHeader,
  type DatePickerTableHeaderProps,
} from "./date-picker-table-header.js"
import {
  DatePickerTableRow,
  type DatePickerTableRowProps,
} from "./date-picker-table-row.js"
import {
  DatePickerTable,
  type DatePickerTableProps,
} from "./date-picker-table.js"
import {
  DatePickerTrigger,
  type DatePickerTriggerProps,
} from "./date-picker-trigger.js"
import {
  DatePickerValueTags,
  type DatePickerValueTagsProps,
} from "./date-picker-value-tags.js"
import {
  DatePickerViewCloseTrigger,
  type DatePickerViewCloseTriggerProps,
} from "./date-picker-view-close-trigger.js"
import {
  DatePickerViewControl,
  type DatePickerViewControlProps,
} from "./date-picker-view-control.js"
import {
  DatePickerViewTrigger,
  type DatePickerViewTriggerProps,
} from "./date-picker-view-trigger.js"
import {DatePickerView, type DatePickerViewProps} from "./date-picker-view.js"
import {DatePickerYearGrid} from "./date-picker-year-grid.js"
import {
  DatePickerYearText,
  type DatePickerYearTextProps,
} from "./date-picker-year-text.js"
import {
  DatePicker as SimpleDatePicker,
  type DatePickerPreset,
  type DatePickerProps,
  type DatePickerVariant,
} from "./date-picker.js"

export {
  CalendarDate,
  getLocalTimeZone,
  isWeekend,
  parseDate,
  today,
  type DateValue,
} from "@qualcomm-ui/utils/date-utils"

export * from "./qds-date-picker-context.js"

export type {
  DatePickerActionsProps,
  DatePickerPreset,
  DatePickerProps,
  DatePickerVariant,
  DatePickerCancelTriggerProps,
  DatePickerClearTriggerProps,
  DatePickerContentProps,
  DatePickerContextProps,
  DatePickerControlProps,
  DatePickerDayGridHeaderProps,
  DatePickerDayGridProps,
  DatePickerErrorIndicatorProps,
  DatePickerErrorTextProps,
  DatePickerHeadlineLabelProps,
  DatePickerHeadlineProps,
  DatePickerHeadlineValueProps,
  DatePickerHintProps,
  DatePickerInputClearTriggerProps,
  DatePickerInputGroupProps,
  DatePickerInputProps,
  DatePickerInputTriggerProps,
  DatePickerLabelProps,
  DatePickerMonthGridProps,
  DatePickerMonthTextProps,
  DatePickerNextTriggerProps,
  DatePickerOkTriggerProps,
  DatePickerPositionerProps,
  DatePickerPresetsProps,
  DatePickerPresetsTriggerProps,
  DatePickerPresetTriggerProps,
  DatePickerPrevTriggerProps,
  DatePickerRangeTextProps,
  DatePickerRootProps,
  DatePickerTableBodyProps,
  DatePickerTableCellProps,
  DatePickerTableCellTriggerProps,
  DatePickerTableHeadProps,
  DatePickerTableHeaderProps,
  DatePickerTableProps,
  DatePickerTableRowProps,
  DatePickerTriggerProps,
  DatePickerValueTagsProps,
  DatePickerViewCloseTriggerProps,
  DatePickerViewControlProps,
  DatePickerViewProps,
  DatePickerViewTriggerProps,
  DatePickerYearTextProps,
}

type DatePickerComponent = typeof SimpleDatePicker & {
  Actions: typeof DatePickerActions
  CancelTrigger: typeof DatePickerCancelTrigger
  ClearTrigger: typeof DatePickerClearTrigger
  Content: typeof DatePickerContent
  Context: typeof DatePickerContext
  Control: typeof DatePickerControl
  DayGrid: typeof DatePickerDayGrid
  DayGridHeader: typeof DatePickerDayGridHeader
  ErrorIndicator: typeof DatePickerErrorIndicator
  ErrorText: typeof DatePickerErrorText
  Headline: typeof DatePickerHeadline
  HeadlineLabel: typeof DatePickerHeadlineLabel
  HeadlineValue: typeof DatePickerHeadlineValue
  Hint: typeof DatePickerHint
  Input: typeof DatePickerInput
  InputClearTrigger: typeof DatePickerInputClearTrigger
  InputGroup: typeof DatePickerInputGroup
  InputIcon: typeof DatePickerInputIcon
  InputTrigger: typeof DatePickerInputTrigger
  Label: typeof DatePickerLabel
  MonthGrid: typeof DatePickerMonthGrid
  MonthText: typeof DatePickerMonthText
  NextTrigger: typeof DatePickerNextTrigger
  OkTrigger: typeof DatePickerOkTrigger
  Positioner: typeof DatePickerPositioner
  Presets: typeof DatePickerPresets
  PresetsTrigger: typeof DatePickerPresetsTrigger
  PresetTrigger: typeof DatePickerPresetTrigger
  PrevTrigger: typeof DatePickerPrevTrigger
  RangeText: typeof DatePickerRangeText
  Root: typeof DatePickerRoot
  Table: typeof DatePickerTable
  TableBody: typeof DatePickerTableBody
  TableCell: typeof DatePickerTableCell
  TableCellTrigger: typeof DatePickerTableCellTrigger
  TableHead: typeof DatePickerTableHead
  TableHeader: typeof DatePickerTableHeader
  TableRow: typeof DatePickerTableRow
  Trigger: typeof DatePickerTrigger
  ValueTags: typeof DatePickerValueTags
  View: typeof DatePickerView
  ViewCloseTrigger: typeof DatePickerViewCloseTrigger
  ViewControl: typeof DatePickerViewControl
  ViewTrigger: typeof DatePickerViewTrigger
  YearGrid: typeof DatePickerYearGrid
  YearText: typeof DatePickerYearText
}

export const DatePicker: DatePickerComponent =
  SimpleDatePicker as DatePickerComponent

DatePicker.Actions = DatePickerActions
DatePicker.CancelTrigger = DatePickerCancelTrigger
DatePicker.ClearTrigger = DatePickerClearTrigger
DatePicker.Content = DatePickerContent
DatePicker.Context = DatePickerContext
DatePicker.Control = DatePickerControl
DatePicker.DayGrid = DatePickerDayGrid
DatePicker.DayGridHeader = DatePickerDayGridHeader
DatePicker.ErrorIndicator = DatePickerErrorIndicator
DatePicker.ErrorText = DatePickerErrorText
DatePicker.Headline = DatePickerHeadline
DatePicker.HeadlineLabel = DatePickerHeadlineLabel
DatePicker.HeadlineValue = DatePickerHeadlineValue
DatePicker.Hint = DatePickerHint
DatePicker.Input = DatePickerInput
DatePicker.InputClearTrigger = DatePickerInputClearTrigger
DatePicker.InputGroup = DatePickerInputGroup
DatePicker.InputIcon = DatePickerInputIcon
DatePicker.InputTrigger = DatePickerInputTrigger
DatePicker.Label = DatePickerLabel
DatePicker.MonthGrid = DatePickerMonthGrid
DatePicker.MonthText = DatePickerMonthText
DatePicker.NextTrigger = DatePickerNextTrigger
DatePicker.OkTrigger = DatePickerOkTrigger
DatePicker.Positioner = DatePickerPositioner
DatePicker.Presets = DatePickerPresets
DatePicker.PresetsTrigger = DatePickerPresetsTrigger
DatePicker.PresetTrigger = DatePickerPresetTrigger
DatePicker.PrevTrigger = DatePickerPrevTrigger
DatePicker.RangeText = DatePickerRangeText
DatePicker.Root = DatePickerRoot
DatePicker.Table = DatePickerTable
DatePicker.TableBody = DatePickerTableBody
DatePicker.TableCell = DatePickerTableCell
DatePicker.TableCellTrigger = DatePickerTableCellTrigger
DatePicker.TableHead = DatePickerTableHead
DatePicker.TableHeader = DatePickerTableHeader
DatePicker.TableRow = DatePickerTableRow
DatePicker.Trigger = DatePickerTrigger
DatePicker.ValueTags = DatePickerValueTags
DatePicker.View = DatePickerView
DatePicker.ViewCloseTrigger = DatePickerViewCloseTrigger
DatePicker.ViewControl = DatePickerViewControl
DatePicker.ViewTrigger = DatePickerViewTrigger
DatePicker.YearGrid = DatePickerYearGrid
DatePicker.YearText = DatePickerYearText
