// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {inputClasses} from "./input.classes"
import type {
  QdsInputApi,
  QdsInputApiProps,
  QdsInputClearTriggerBindings,
  QdsInputEndIconBindings,
  QdsInputErrorIndicatorBindings,
  QdsInputErrorTextBindings,
  QdsInputGroupBindings,
  QdsInputHintBindings,
  QdsInputInputBindings,
  QdsInputLabelBindings,
  QdsInputRequiredIndicatorBindings,
  QdsInputRootBindings,
  QdsInputSize,
  QdsInputStartIconBindings,
} from "./input.types"

const inputIconSizes: Record<QdsInputSize, number> = {
  lg: 20,
  md: 16,
  sm: 16,
}

export function createQdsInputApi<IconType>(
  props: QdsInputApiProps<IconType>,
  normalize: PropNormalizer,
): QdsInputApi<IconType> {
  const size = props.size || "md"

  const iconSize = inputIconSizes[size] || inputIconSizes.md

  return {
    endIcon: props.endIcon,
    iconSize,
    size,
    startIcon: props.startIcon,

    // group: prop getters
    getClearTriggerBindings(): QdsInputClearTriggerBindings {
      return normalize.element({
        className: inputClasses.clearTrigger,
        "data-size": size,
      })
    },
    getEndIconBindings(): QdsInputEndIconBindings {
      return normalize.element({
        className: inputClasses.icon,
        "data-part": "end-icon",
        "data-size": size,
      })
    },
    getErrorIndicatorBindings(): QdsInputErrorIndicatorBindings {
      return normalize.element({
        className: inputClasses.errorIndicator,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsInputErrorTextBindings {
      return normalize.element({
        className: inputClasses.errorText,
      })
    },
    getGroupBindings(): QdsInputGroupBindings {
      return normalize.element({
        className: inputClasses.group,
        "data-size": size,
      })
    },
    getHintBindings(): QdsInputHintBindings {
      return normalize.element({
        className: inputClasses.hint,
      })
    },
    getInputBindings(): QdsInputInputBindings {
      return normalize.input({
        className: inputClasses.input,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsInputLabelBindings {
      return normalize.label({
        className: inputClasses.label,
        "data-size": size,
      })
    },
    getRequiredIndicatorBindings(): QdsInputRequiredIndicatorBindings {
      return normalize.element({
        className: inputClasses.requiredIndicator,
      })
    },
    getRootBindings(): QdsInputRootBindings {
      return normalize.element({
        className: inputClasses.root,
        "data-size": size,
      })
    },
    getStartIconBindings(): QdsInputStartIconBindings {
      return normalize.element({
        className: inputClasses.icon,
        "data-part": "start-icon",
        "data-size": size,
      })
    },
  }
}
