// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {numberInputClasses} from "./number-input.classes"
import type {
  QdsNumberInputApi,
  QdsNumberInputApiProps,
  QdsNumberInputControlBindings,
  QdsNumberInputDecrementTriggerBindings,
  QdsNumberInputErrorIndicatorBindings,
  QdsNumberInputIncrementTriggerBindings,
  QdsNumberInputInputBindings,
  QdsNumberInputInputGroupBindings,
} from "./number-input.types"

export function createQdsNumberInputApi(
  props: Explicit<QdsNumberInputApiProps>,
  normalize: PropNormalizer,
): QdsNumberInputApi {
  const size = props.size || "md"
  return {
    size,

    // group: prop getters
    getControlBindings(): QdsNumberInputControlBindings {
      return normalize.button({
        className: numberInputClasses.control,
        "data-size": size,
      })
    },
    getDecrementTriggerBindings(): QdsNumberInputDecrementTriggerBindings {
      return normalize.button({
        className: numberInputClasses.stepTrigger,
        "data-size": size,
      })
    },
    getErrorIndicatorBindings(): QdsNumberInputErrorIndicatorBindings {
      return normalize.element({
        className: numberInputClasses.errorIndicator,
        "data-size": size,
      })
    },
    getIncrementTriggerBindings(): QdsNumberInputIncrementTriggerBindings {
      return normalize.button({
        className: numberInputClasses.stepTrigger,
        "data-size": size,
      })
    },
    getInputBindings(): QdsNumberInputInputBindings {
      return normalize.input({
        className: numberInputClasses.input,
        "data-size": size,
      })
    },
    getInputGroupBindings(): QdsNumberInputInputGroupBindings {
      return normalize.element({
        className: numberInputClasses.inputGroup,
        "data-part": "input-group",
        "data-size": size,
      })
    },
  }
}
