// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {datePickerClasses} from "./date-picker.classes"

export type QdsDatePickerSize = "sm" | "md" | "lg"

export interface QdsDatePickerApiProps {
  /**
   * The size of the date picker and its elements.
   * @default 'md'
   */
  size?: QdsDatePickerSize
}

type DatePickerClasses = typeof datePickerClasses

export interface QdsDatePickerRootBindings {
  className: DatePickerClasses["root"]
  "data-size": QdsDatePickerSize
}

export interface QdsDatePickerLabelBindings {
  className: DatePickerClasses["label"]
}

export interface QdsDatePickerInputBindings {
  className: DatePickerClasses["input"]
  "data-size": QdsDatePickerSize
}

export interface QdsDatePickerTriggerBindings {
  className: DatePickerClasses["trigger"]
  "data-size": QdsDatePickerSize
}

export interface QdsDatePickerClearTriggerBindings {
  className: DatePickerClasses["clearTrigger"]
  "data-size": QdsDatePickerSize
}

export interface QdsDatePickerPositionerBindings {
  className: DatePickerClasses["positioner"]
}

export interface QdsDatePickerContentBindings {
  className: DatePickerClasses["content"]
}

export interface QdsDatePickerControlsBindings {
  className: DatePickerClasses["controls"]
}

export interface QdsDatePickerPrevTriggerBindings {
  className: DatePickerClasses["prevTrigger"]
}

export interface QdsDatePickerNextTriggerBindings {
  className: DatePickerClasses["nextTrigger"]
}

export interface QdsDatePickerViewTriggerBindings {
  className: DatePickerClasses["viewTrigger"]
}

export interface QdsDatePickerCalendarBindings {
  className: DatePickerClasses["calendar"]
}

export interface QdsDatePickerWeekdayBindings {
  className: DatePickerClasses["weekday"]
}

export interface QdsDatePickerCellBindings {
  className: DatePickerClasses["cell"]
}

export interface QdsDatePickerTodayTriggerBindings {
  className: DatePickerClasses["todayTrigger"]
}

export interface QdsDatePickerApi {
  size: QdsDatePickerSize

  // group: bindings
  getCalendarBindings(): QdsDatePickerCalendarBindings
  getCellBindings(): QdsDatePickerCellBindings
  getClearTriggerBindings(): QdsDatePickerClearTriggerBindings
  getContentBindings(): QdsDatePickerContentBindings
  getControlsBindings(): QdsDatePickerControlsBindings
  getInputBindings(): QdsDatePickerInputBindings
  getLabelBindings(): QdsDatePickerLabelBindings
  getNextTriggerBindings(): QdsDatePickerNextTriggerBindings
  getPositionerBindings(): QdsDatePickerPositionerBindings
  getPrevTriggerBindings(): QdsDatePickerPrevTriggerBindings
  getRootBindings(): QdsDatePickerRootBindings
  getTodayTriggerBindings(): QdsDatePickerTodayTriggerBindings
  getTriggerBindings(): QdsDatePickerTriggerBindings
  getViewTriggerBindings(): QdsDatePickerViewTriggerBindings
  getWeekdayBindings(): QdsDatePickerWeekdayBindings
}
