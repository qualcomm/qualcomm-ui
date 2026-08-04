// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {checkboxAnatomy} from "@qualcomm-ui/core/checkbox"
import {inputClasses} from "@qualcomm-ui/qds-core/input"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {checkboxClasses} from "./checkbox.classes.js"
import type {
  QdsCheckboxApi,
  QdsCheckboxApiProps,
  QdsCheckboxControlBindings,
  QdsCheckboxErrorTextBindings,
  QdsCheckboxHiddenInputBindings,
  QdsCheckboxHintBindings,
  QdsCheckboxIndicatorBindings,
  QdsCheckboxLabelBindings,
  QdsCheckboxRootBindings,
} from "./checkbox.types.js"

const parts = checkboxAnatomy.parts

export function createQdsCheckboxApi(
  props: Explicit<QdsCheckboxApiProps>,
  normalize: PropNormalizer,
): QdsCheckboxApi {
  const size = props.size || "md"
  return {
    size,

    // group: bindings
    getControlBindings(): QdsCheckboxControlBindings {
      return normalize.element({
        ...parts.control,
        className: checkboxClasses.control,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsCheckboxErrorTextBindings {
      return normalize.element({
        ...parts.errorText,
        className: inputClasses.errorText,
      })
    },
    getHiddenInputBindings(): QdsCheckboxHiddenInputBindings {
      return normalize.input({
        ...parts.hiddenInput,
        className: checkboxClasses.hiddenInput,
      })
    },
    getHintBindings(): QdsCheckboxHintBindings {
      return normalize.element({
        ...parts.hint,
        className: inputClasses.hint,
      })
    },
    getIndicatorBindings(): QdsCheckboxIndicatorBindings {
      return normalize.element({
        ...parts.indicator,
        className: checkboxClasses.indicator,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsCheckboxLabelBindings {
      return normalize.element({
        ...parts.label,
        className: checkboxClasses.label,
        "data-size": size,
      })
    },
    getRootBindings(): QdsCheckboxRootBindings {
      return normalize.label({
        ...parts.root,
        className: checkboxClasses.root,
      })
    },
  }
}
