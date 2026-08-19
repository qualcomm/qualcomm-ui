// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {checkboxClasses} from "@qualcomm-ui/qds-core/checkbox"
import {inputClasses} from "@qualcomm-ui/qds-core/input"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {radioClasses} from "./radio.classes.js"
import type {
  QdsRadioApi,
  QdsRadioApiProps,
  QdsRadioGroupBindings,
  QdsRadioGroupErrorTextBindings,
  QdsRadioGroupHintBindings,
  QdsRadioGroupItemsBindings,
  QdsRadioGroupLabelBindings,
  QdsRadioItemBindings,
  QdsRadioItemCheckboxControlBindings,
  QdsRadioItemCheckboxIndicatorBindings,
  QdsRadioItemControlBindings,
  QdsRadioItemHiddenInputBindings,
  QdsRadioItemHintBindings,
  QdsRadioItemLabelBindings,
} from "./radio.types.js"

export function createQdsRadioApi(
  {indented = false, size = "md"}: QdsRadioApiProps,
  normalize: PropNormalizer,
): QdsRadioApi {
  return {
    size,

    // group: bindings
    getGroupBindings(): QdsRadioGroupBindings {
      return normalize.element({
        className: radioClasses.group,
      })
    },
    getGroupErrorTextBindings(): QdsRadioGroupErrorTextBindings {
      return normalize.element({
        className: inputClasses.errorText,
      })
    },
    getGroupHintBindings(): QdsRadioGroupHintBindings {
      return normalize.element({
        className: inputClasses.hint,
      })
    },
    getGroupItemsBindings(): QdsRadioGroupItemsBindings {
      return normalize.element({
        className: radioClasses.items,
        "data-indented": booleanDataAttr(indented),
        "data-size": size,
      })
    },
    getGroupLabelBindings(): QdsRadioGroupLabelBindings {
      return normalize.element({
        className: radioClasses.groupLabel,
        "data-size": size,
      })
    },
    getItemBindings(): QdsRadioItemBindings {
      return normalize.label({
        className: radioClasses.item,
      })
    },
    getItemCheckboxControlBindings(): QdsRadioItemCheckboxControlBindings {
      return normalize.element({
        className: checkboxClasses.control,
        "data-size": size,
      })
    },
    getItemCheckboxIndicatorBindings(): QdsRadioItemCheckboxIndicatorBindings {
      return normalize.element({
        className: checkboxClasses.indicator,
        "data-size": size,
      })
    },
    getItemControlBindings(): QdsRadioItemControlBindings {
      return normalize.element({
        className: radioClasses.itemControl,
        "data-size": size,
      })
    },
    getItemHiddenInputBindings(): QdsRadioItemHiddenInputBindings {
      return normalize.input({
        className: radioClasses.itemHiddenInput,
      })
    },
    getItemHintBindings(): QdsRadioItemHintBindings {
      return normalize.element({
        className: inputClasses.hint,
      })
    },
    getItemLabelBindings(): QdsRadioItemLabelBindings {
      return normalize.element({
        className: radioClasses.itemLabel,
        "data-size": size,
      })
    },
  }
}
