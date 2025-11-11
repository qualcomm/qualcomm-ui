// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {toastClasses} from "./toast.classes"
import type {
  QdsToastActionBindings,
  QdsToastApi,
  QdsToastApiProps,
  QdsToastCloseButtonBindings,
  QdsToastDescriptionBindings,
  QdsToastIconBindings,
  QdsToastLabelBindings,
  QdsToastRootBindings,
} from "./toast.types"

export function createQdsToastApi(
  props: Explicit<QdsToastApiProps>,
  normalize: PropNormalizer,
): QdsToastApi {
  const emphasis = props.emphasis || "info"
  return {
    emphasis,

    // group: bindings
    getActionBindings(): QdsToastActionBindings {
      return normalize.element({
        className: toastClasses.action,
      })
    },

    getCloseButtonBindings(): QdsToastCloseButtonBindings {
      return normalize.element({
        className: toastClasses.closeButton,
      })
    },
    getDescriptionBindings(): QdsToastDescriptionBindings {
      return normalize.element({
        className: toastClasses.description,
      })
    },
    getIconBindings(): QdsToastIconBindings {
      return normalize.element({
        className: toastClasses.icon,
      })
    },
    getLabelBindings(): QdsToastLabelBindings {
      return normalize.element({
        className: toastClasses.label,
      })
    },
    getRootBindings(): QdsToastRootBindings {
      return normalize.element({
        className: toastClasses.root,
        "data-emphasis": emphasis,
      })
    },
  }
}
