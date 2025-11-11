// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inputClasses} from "@qualcomm-ui/qds-core/input"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {switchClasses} from "./switch.classes"
import type {
  QdsSwitchApi,
  QdsSwitchApiProps,
  QdsSwitchControlBindings,
  QdsSwitchErrorTextBindings,
  QdsSwitchHiddenInputBindings,
  QdsSwitchLabelBindings,
  QdsSwitchRootBindings,
  QdsSwitchThumbBindings,
} from "./switch.types"

export function createQdsSwitchApi(
  props: QdsSwitchApiProps,
  normalize: PropNormalizer,
): QdsSwitchApi {
  const size = props.size || "md"

  return {
    getControlBindings(): QdsSwitchControlBindings {
      return normalize.element({
        className: switchClasses.control,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsSwitchErrorTextBindings {
      return normalize.element({
        className: inputClasses.errorText,
      })
    },
    getHiddenInputBindings(): QdsSwitchHiddenInputBindings {
      return normalize.input({
        className: switchClasses.hiddenInput,
      })
    },
    getLabelBindings(): QdsSwitchLabelBindings {
      return normalize.element({
        className: switchClasses.label,
      })
    },
    getRootBindings(): QdsSwitchRootBindings {
      return normalize.element({
        className: switchClasses.root,
        "data-size": size,
      })
    },
    getThumbBindings(): QdsSwitchThumbBindings {
      return normalize.element({
        className: switchClasses.thumb,
        "data-size": size,
      })
    },
    size,
  }
}
