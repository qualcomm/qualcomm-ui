// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {datePickerClasses} from "./date-picker.classes"
import type {
  QdsDatePickerApi,
  QdsDatePickerApiProps,
  QdsDatePickerCalendarBindings,
  QdsDatePickerCellBindings,
  QdsDatePickerClearTriggerBindings,
  QdsDatePickerContentBindings,
  QdsDatePickerControlsBindings,
  QdsDatePickerInputBindings,
  QdsDatePickerLabelBindings,
  QdsDatePickerNextTriggerBindings,
  QdsDatePickerPositionerBindings,
  QdsDatePickerPrevTriggerBindings,
  QdsDatePickerRootBindings,
  QdsDatePickerTodayTriggerBindings,
  QdsDatePickerTriggerBindings,
  QdsDatePickerViewTriggerBindings,
  QdsDatePickerWeekdayBindings,
} from "./date-picker.types"

export function createQdsDatePickerApi(
  props: QdsDatePickerApiProps,
  normalize: PropNormalizer,
): QdsDatePickerApi {
  const size = props.size || "md"

  return {
    size,

    // group: bindings
    getCalendarBindings(): QdsDatePickerCalendarBindings {
      return normalize.element({
        className: datePickerClasses.calendar,
      })
    },

    getCellBindings(): QdsDatePickerCellBindings {
      return normalize.element({
        className: datePickerClasses.cell,
      })
    },

    getClearTriggerBindings(): QdsDatePickerClearTriggerBindings {
      return normalize.element({
        className: datePickerClasses.clearTrigger,
        "data-size": size,
      })
    },

    getContentBindings(): QdsDatePickerContentBindings {
      return normalize.element({
        className: datePickerClasses.content,
      })
    },

    getControlsBindings(): QdsDatePickerControlsBindings {
      return normalize.element({
        className: datePickerClasses.controls,
      })
    },

    getInputBindings(): QdsDatePickerInputBindings {
      return normalize.element({
        className: datePickerClasses.input,
        "data-size": size,
      })
    },

    getLabelBindings(): QdsDatePickerLabelBindings {
      return normalize.element({
        className: datePickerClasses.label,
      })
    },

    getNextTriggerBindings(): QdsDatePickerNextTriggerBindings {
      return normalize.element({
        className: datePickerClasses.nextTrigger,
      })
    },

    getPositionerBindings(): QdsDatePickerPositionerBindings {
      return normalize.element({
        className: datePickerClasses.positioner,
      })
    },

    getPrevTriggerBindings(): QdsDatePickerPrevTriggerBindings {
      return normalize.element({
        className: datePickerClasses.prevTrigger,
      })
    },

    getRootBindings(): QdsDatePickerRootBindings {
      return normalize.element({
        className: datePickerClasses.root,
        "data-size": size,
      })
    },

    getTodayTriggerBindings(): QdsDatePickerTodayTriggerBindings {
      return normalize.element({
        className: datePickerClasses.todayTrigger,
      })
    },

    getTriggerBindings(): QdsDatePickerTriggerBindings {
      return normalize.element({
        className: datePickerClasses.trigger,
        "data-size": size,
      })
    },

    getViewTriggerBindings(): QdsDatePickerViewTriggerBindings {
      return normalize.element({
        className: datePickerClasses.viewTrigger,
      })
    },

    getWeekdayBindings(): QdsDatePickerWeekdayBindings {
      return normalize.element({
        className: datePickerClasses.weekday,
      })
    },
  }
}
