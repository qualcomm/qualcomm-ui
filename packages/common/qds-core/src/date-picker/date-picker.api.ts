// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {qdsDatePickerAnatomy} from "./date-picker.anatomy.js"
import {datePickerClasses} from "./date-picker.classes.js"
import type {
  QdsDatePickerActionsBindings,
  QdsDatePickerApi,
  QdsDatePickerApiProps,
  QdsDatePickerClearTriggerBindings,
  QdsDatePickerContentBindings,
  QdsDatePickerControlBindings,
  QdsDatePickerControlGroupBindings,
  QdsDatePickerDividerBindings,
  QdsDatePickerErrorIndicatorBindings,
  QdsDatePickerErrorTextBindings,
  QdsDatePickerHeadlineBindings,
  QdsDatePickerHeadlineLabelBindings,
  QdsDatePickerHeadlineValueBindings,
  QdsDatePickerHintBindings,
  QdsDatePickerInputBindings,
  QdsDatePickerInputGroupBindings,
  QdsDatePickerInputIconBindings,
  QdsDatePickerLabelBindings,
  QdsDatePickerNextTriggerBindings,
  QdsDatePickerPositionerBindings,
  QdsDatePickerPresetsBindings,
  QdsDatePickerPresetsTriggerBindings,
  QdsDatePickerPresetTriggerBindings,
  QdsDatePickerPrevTriggerBindings,
  QdsDatePickerRangeSeparatorBindings,
  QdsDatePickerRangeTextBindings,
  QdsDatePickerRootBindings,
  QdsDatePickerTableBindings,
  QdsDatePickerTableBodyBindings,
  QdsDatePickerTableCellBindings,
  QdsDatePickerTableCellTriggerBindings,
  QdsDatePickerTableHeadBindings,
  QdsDatePickerTableHeaderBindings,
  QdsDatePickerTableRowBindings,
  QdsDatePickerTriggerBindings,
  QdsDatePickerValueTagsBindings,
  QdsDatePickerViewBindings,
  QdsDatePickerViewCloseTriggerBindings,
  QdsDatePickerViewControlBindings,
  QdsDatePickerViewTriggerBindings,
} from "./date-picker.types.js"

const parts = qdsDatePickerAnatomy.parts

export function createQdsDatePickerApi(
  props: QdsDatePickerApiProps,
  normalize: PropNormalizer,
): QdsDatePickerApi {
  const size = props.size || "md"
  const triggerSize = size === "lg" ? "md" : size

  return {
    size,
    triggerSize,

    // group: bindings
    getActionsBindings(): QdsDatePickerActionsBindings {
      return normalize.element({
        ...parts.actions,
        className: datePickerClasses.actions,
      })
    },
    getClearTriggerBindings(): QdsDatePickerClearTriggerBindings {
      return normalize.element({className: datePickerClasses.clearTrigger})
    },
    getContentBindings(): QdsDatePickerContentBindings {
      return normalize.element({className: datePickerClasses.content})
    },
    getControlBindings(): QdsDatePickerControlBindings {
      return normalize.element({className: datePickerClasses.control})
    },
    getControlGroupBindings(): QdsDatePickerControlGroupBindings {
      return normalize.element({
        ...parts.controlGroup,
        className: datePickerClasses.controlGroup,
        "data-size": size,
      })
    },
    getDividerBindings(): QdsDatePickerDividerBindings {
      return normalize.element({
        ...parts.divider,
        className: datePickerClasses.divider,
      })
    },
    getErrorIndicatorBindings(): QdsDatePickerErrorIndicatorBindings {
      return normalize.element({
        className: datePickerClasses.errorIndicator,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsDatePickerErrorTextBindings {
      return normalize.element({className: datePickerClasses.errorText})
    },
    getHeadlineBindings(): QdsDatePickerHeadlineBindings {
      return normalize.element({
        ...parts.headline,
        className: datePickerClasses.headline,
      })
    },
    getHeadlineLabelBindings(): QdsDatePickerHeadlineLabelBindings {
      return normalize.element({
        ...parts.headlineLabel,
        className: datePickerClasses.headlineLabel,
      })
    },
    getHeadlineValueBindings(): QdsDatePickerHeadlineValueBindings {
      return normalize.element({
        ...parts.headlineValue,
        className: datePickerClasses.headlineValue,
      })
    },
    getHintBindings(): QdsDatePickerHintBindings {
      return normalize.element({className: datePickerClasses.hint})
    },
    getInputBindings(): QdsDatePickerInputBindings {
      return normalize.element({
        className: datePickerClasses.input,
        "data-size": size,
      })
    },
    getInputGroupBindings(): QdsDatePickerInputGroupBindings {
      return normalize.element({
        ...parts.inputGroup,
        className: datePickerClasses.inputGroup,
        "data-size": size,
      })
    },
    getInputIconBindings(): QdsDatePickerInputIconBindings {
      return normalize.element({
        ...parts.inputIcon,
        className: datePickerClasses.inputIcon,
      })
    },
    getLabelBindings(): QdsDatePickerLabelBindings {
      return normalize.element({
        className: datePickerClasses.label,
        "data-size": size,
      })
    },
    getNextTriggerBindings(): QdsDatePickerNextTriggerBindings {
      return normalize.element({className: datePickerClasses.nextTrigger})
    },
    getPositionerBindings(): QdsDatePickerPositionerBindings {
      return normalize.element({className: datePickerClasses.positioner})
    },
    getPresetsBindings(): QdsDatePickerPresetsBindings {
      return normalize.element({className: datePickerClasses.presets})
    },
    getPresetsTriggerBindings(): QdsDatePickerPresetsTriggerBindings {
      return normalize.element({className: datePickerClasses.presetsTrigger})
    },
    getPresetTriggerBindings(): QdsDatePickerPresetTriggerBindings {
      return normalize.element({className: datePickerClasses.presetTrigger})
    },
    getPrevTriggerBindings(): QdsDatePickerPrevTriggerBindings {
      return normalize.element({className: datePickerClasses.prevTrigger})
    },
    getRangeSeparatorBindings(): QdsDatePickerRangeSeparatorBindings {
      return normalize.element({
        ...parts.rangeSeparator,
        className: datePickerClasses.rangeSeparator,
      })
    },
    getRangeTextBindings(): QdsDatePickerRangeTextBindings {
      return normalize.element({className: datePickerClasses.rangeText})
    },
    getRootBindings(): QdsDatePickerRootBindings {
      return normalize.element({
        className: datePickerClasses.root,
        "data-hide-outside-days": booleanDataAttr(props.hideOutsideDays),
      })
    },
    getTableBindings(): QdsDatePickerTableBindings {
      return normalize.element({className: datePickerClasses.table})
    },
    getTableBodyBindings(): QdsDatePickerTableBodyBindings {
      return normalize.element({className: datePickerClasses.tableBody})
    },
    getTableCellBindings(): QdsDatePickerTableCellBindings {
      return normalize.element({className: datePickerClasses.tableCell})
    },
    getTableCellTriggerBindings(): QdsDatePickerTableCellTriggerBindings {
      return normalize.element({className: datePickerClasses.tableCellTrigger})
    },
    getTableHeadBindings(): QdsDatePickerTableHeadBindings {
      return normalize.element({className: datePickerClasses.tableHead})
    },
    getTableHeaderBindings(): QdsDatePickerTableHeaderBindings {
      return normalize.element({className: datePickerClasses.tableHeader})
    },
    getTableRowBindings(): QdsDatePickerTableRowBindings {
      return normalize.element({className: datePickerClasses.tableRow})
    },
    getTriggerBindings(): QdsDatePickerTriggerBindings {
      return normalize.element({className: datePickerClasses.trigger})
    },
    getValueTagsBindings(): QdsDatePickerValueTagsBindings {
      return normalize.element({
        ...parts.valueTags,
        className: datePickerClasses.valueTags,
      })
    },
    getViewBindings(): QdsDatePickerViewBindings {
      return normalize.element({className: datePickerClasses.view})
    },
    getViewCloseTriggerBindings(): QdsDatePickerViewCloseTriggerBindings {
      return normalize.element({className: datePickerClasses.viewCloseTrigger})
    },
    getViewControlBindings(): QdsDatePickerViewControlBindings {
      return normalize.element({className: datePickerClasses.viewControl})
    },
    getViewTriggerBindings(): QdsDatePickerViewTriggerBindings {
      return normalize.element({className: datePickerClasses.viewTrigger})
    },
  }
}
