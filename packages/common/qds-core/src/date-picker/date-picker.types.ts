// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsInputSize} from "@qualcomm-ui/qds-core/input"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {qdsDatePickerAnatomy} from "./date-picker.anatomy.js"
import type {datePickerClasses} from "./date-picker.classes.js"

export interface QdsDatePickerApiProps {
  /**
   * Whether to hide days from the previous and next months in the current
   * month view. By default those days are shown.
   *
   * @default false
   */
  hideOutsideDays?: boolean

  /**
   * The size of the input field and its elements. Does not affect the calendar pane.
   *
   * @default 'md'
   */
  size?: QdsInputSize
}

type DatePickerClasses = typeof datePickerClasses

type PartName = AnatomyPartName<typeof qdsDatePickerAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"datePicker", P> {}

interface ClassNameBindings<K extends keyof DatePickerClasses> {
  className: DatePickerClasses[K]
}

export interface QdsDatePickerRootBindings extends ClassNameBindings<"root"> {
  "data-hide-outside-days": BooleanDataAttr
}
export interface QdsDatePickerControlGroupBindings
  extends ClassNameBindings<"controlGroup">, Part<"controlGroup"> {
  "data-size": QdsInputSize
}
export interface QdsDatePickerInputGroupBindings
  extends ClassNameBindings<"inputGroup">, Part<"inputGroup"> {
  "data-size": QdsInputSize
}
export interface QdsDatePickerInputBindings extends ClassNameBindings<"input"> {
  "data-size": QdsInputSize
}
export interface QdsDatePickerLabelBindings extends ClassNameBindings<"label"> {
  "data-size": QdsInputSize
}
export interface QdsDatePickerErrorIndicatorBindings extends ClassNameBindings<"errorIndicator"> {
  "data-size": QdsInputSize
}
export interface QdsDatePickerActionsBindings
  extends ClassNameBindings<"actions">, Part<"actions"> {}
export type QdsDatePickerClearTriggerBindings =
  ClassNameBindings<"clearTrigger">
export type QdsDatePickerContentBindings = ClassNameBindings<"content">
export type QdsDatePickerControlBindings = ClassNameBindings<"control">
export interface QdsDatePickerDividerBindings
  extends ClassNameBindings<"divider">, Part<"divider"> {}
export type QdsDatePickerErrorTextBindings = ClassNameBindings<"errorText">
export interface QdsDatePickerHeadlineBindings
  extends ClassNameBindings<"headline">, Part<"headline"> {}
export interface QdsDatePickerHeadlineLabelBindings
  extends ClassNameBindings<"headlineLabel">, Part<"headlineLabel"> {}
export interface QdsDatePickerHeadlineValueBindings
  extends ClassNameBindings<"headlineValue">, Part<"headlineValue"> {}
export type QdsDatePickerHintBindings = ClassNameBindings<"hint">
export interface QdsDatePickerInputIconBindings
  extends ClassNameBindings<"inputIcon">, Part<"inputIcon"> {}
export interface QdsDatePickerRangeSeparatorBindings
  extends ClassNameBindings<"rangeSeparator">, Part<"rangeSeparator"> {}
export interface QdsDatePickerValueTagsBindings
  extends ClassNameBindings<"valueTags">, Part<"valueTags"> {}
export type QdsDatePickerNextTriggerBindings = ClassNameBindings<"nextTrigger">
export type QdsDatePickerPositionerBindings = ClassNameBindings<"positioner">
export type QdsDatePickerPresetsBindings = ClassNameBindings<"presets">
export type QdsDatePickerPresetsTriggerBindings =
  ClassNameBindings<"presetsTrigger">
export type QdsDatePickerPresetTriggerBindings =
  ClassNameBindings<"presetTrigger">
export type QdsDatePickerPrevTriggerBindings = ClassNameBindings<"prevTrigger">
export type QdsDatePickerRangeTextBindings = ClassNameBindings<"rangeText">
export type QdsDatePickerTableBindings = ClassNameBindings<"table">
export type QdsDatePickerTableBodyBindings = ClassNameBindings<"tableBody">
export type QdsDatePickerTableCellBindings = ClassNameBindings<"tableCell">
export type QdsDatePickerTableCellTriggerBindings =
  ClassNameBindings<"tableCellTrigger">
export type QdsDatePickerTableHeadBindings = ClassNameBindings<"tableHead">
export type QdsDatePickerTableHeaderBindings = ClassNameBindings<"tableHeader">
export type QdsDatePickerTableRowBindings = ClassNameBindings<"tableRow">
export type QdsDatePickerTriggerBindings = ClassNameBindings<"trigger">
export type QdsDatePickerViewBindings = ClassNameBindings<"view">
export type QdsDatePickerViewCloseTriggerBindings =
  ClassNameBindings<"viewCloseTrigger">
export type QdsDatePickerViewControlBindings = ClassNameBindings<"viewControl">
export type QdsDatePickerViewTriggerBindings = ClassNameBindings<"viewTrigger">

export interface QdsDatePickerApi {
  /**
   * The resolved input size.
   */
  size: QdsInputSize

  /**
   * The size to render the inline trigger buttons (calendar toggle, clear).
   * The `lg` field uses the `md` button, so this is never `lg`.
   */
  triggerSize: QdsInputSize

  // group: bindings
  getActionsBindings(): QdsDatePickerActionsBindings
  getClearTriggerBindings(): QdsDatePickerClearTriggerBindings
  getContentBindings(): QdsDatePickerContentBindings
  getControlBindings(): QdsDatePickerControlBindings
  getControlGroupBindings(): QdsDatePickerControlGroupBindings
  getDividerBindings(): QdsDatePickerDividerBindings
  getErrorIndicatorBindings(): QdsDatePickerErrorIndicatorBindings
  getErrorTextBindings(): QdsDatePickerErrorTextBindings
  getHeadlineBindings(): QdsDatePickerHeadlineBindings
  getHeadlineLabelBindings(): QdsDatePickerHeadlineLabelBindings
  getHeadlineValueBindings(): QdsDatePickerHeadlineValueBindings
  getHintBindings(): QdsDatePickerHintBindings
  getInputBindings(): QdsDatePickerInputBindings
  getInputGroupBindings(): QdsDatePickerInputGroupBindings
  getInputIconBindings(): QdsDatePickerInputIconBindings
  getLabelBindings(): QdsDatePickerLabelBindings
  getNextTriggerBindings(): QdsDatePickerNextTriggerBindings
  getPositionerBindings(): QdsDatePickerPositionerBindings
  getPresetsBindings(): QdsDatePickerPresetsBindings
  getPresetsTriggerBindings(): QdsDatePickerPresetsTriggerBindings
  getPresetTriggerBindings(): QdsDatePickerPresetTriggerBindings
  getPrevTriggerBindings(): QdsDatePickerPrevTriggerBindings
  getRangeSeparatorBindings(): QdsDatePickerRangeSeparatorBindings
  getRangeTextBindings(): QdsDatePickerRangeTextBindings
  getRootBindings(): QdsDatePickerRootBindings
  getTableBindings(): QdsDatePickerTableBindings
  getTableBodyBindings(): QdsDatePickerTableBodyBindings
  getTableCellBindings(): QdsDatePickerTableCellBindings
  getTableCellTriggerBindings(): QdsDatePickerTableCellTriggerBindings
  getTableHeadBindings(): QdsDatePickerTableHeadBindings
  getTableHeaderBindings(): QdsDatePickerTableHeaderBindings
  getTableRowBindings(): QdsDatePickerTableRowBindings
  getTriggerBindings(): QdsDatePickerTriggerBindings
  getValueTagsBindings(): QdsDatePickerValueTagsBindings
  getViewBindings(): QdsDatePickerViewBindings
  getViewCloseTriggerBindings(): QdsDatePickerViewCloseTriggerBindings
  getViewControlBindings(): QdsDatePickerViewControlBindings
  getViewTriggerBindings(): QdsDatePickerViewTriggerBindings
}
