// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inputClasses} from "@qualcomm-ui/qds-core/input"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {radioClasses} from "./radio.classes"
import type {
  QdsRadioApi,
  QdsRadioApiProps,
  QdsRadioErrorTextBindings,
  QdsRadioGroupBindings,
  QdsRadioGroupItemsBindings,
  QdsRadioGroupLabelBindings,
  QdsRadioItemBindings,
  QdsRadioItemControlBindings,
  QdsRadioItemHiddenInputBindings,
  QdsRadioItemLabelBindings,
} from "./radio.types"

export function createQdsRadioApi(
  props: Explicit<QdsRadioApiProps>,
  normalize: PropNormalizer,
): QdsRadioApi {
  const size = props.size || "md"
  return {
    size,

    // group: bindings
    getErrorTextBindings(): QdsRadioErrorTextBindings {
      return normalize.element({
        className: inputClasses.errorText,
      })
    },
    getGroupBindings(): QdsRadioGroupBindings {
      return normalize.element({
        className: radioClasses.group,
      })
    },
    getGroupItemsBindings(): QdsRadioGroupItemsBindings {
      return normalize.element({
        className: radioClasses.items,
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
    getItemLabelBindings(): QdsRadioItemLabelBindings {
      return normalize.element({
        className: radioClasses.itemLabel,
        "data-size": size,
      })
    },
  }
}
