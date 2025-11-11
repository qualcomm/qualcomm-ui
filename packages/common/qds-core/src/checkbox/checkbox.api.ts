// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inputClasses} from "@qualcomm-ui/qds-core/input"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {checkboxClasses} from "./checkbox.classes"
import type {
  QdsCheckboxApi,
  QdsCheckboxApiProps,
  QdsCheckboxControlBindings,
  QdsCheckboxErrorTextBindings,
  QdsCheckboxHiddenInputBindings,
  QdsCheckboxIndicatorBindings,
  QdsCheckboxLabelBindings,
  QdsCheckboxRootBindings,
} from "./checkbox.types"

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
        className: checkboxClasses.control,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsCheckboxErrorTextBindings {
      return normalize.element({
        className: inputClasses.errorText,
      })
    },
    getHiddenInputBindings(): QdsCheckboxHiddenInputBindings {
      return normalize.input({
        className: checkboxClasses.hiddenInput,
      })
    },
    getIndicatorBindings(): QdsCheckboxIndicatorBindings {
      return normalize.element({
        className: checkboxClasses.indicator,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsCheckboxLabelBindings {
      return normalize.element({
        className: checkboxClasses.label,
        "data-size": size,
      })
    },
    getRootBindings(): QdsCheckboxRootBindings {
      return normalize.label({
        className: checkboxClasses.root,
      })
    },
  }
}
