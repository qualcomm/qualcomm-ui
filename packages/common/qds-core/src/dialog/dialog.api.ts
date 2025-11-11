// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {dialogClasses} from "./dialog.classes"
import type {
  QdsDialogApi,
  QdsDialogApiProps,
  QdsDialogBackdropBindings,
  QdsDialogBodyBindings,
  QdsDialogCloseButtonBindings,
  QdsDialogContentBindings,
  QdsDialogFooterBindings,
  QdsDialogHeadingBindings,
  QdsDialogIndicatorIconBindings,
  QdsDialogPositionerBindings,
} from "./dialog.types"

export function createQdsDialogApi(
  props: Explicit<QdsDialogApiProps>,
  normalize: PropNormalizer,
): QdsDialogApi {
  const size = props.size || "sm"
  const emphasis = props.emphasis || "neutral"
  const scrollBehavior = props.scrollBehavior || "outside"

  return {
    emphasis,
    size,

    // group: bindings
    getBackdropBindings(): QdsDialogBackdropBindings {
      return normalize.element({
        className: dialogClasses.backdrop,
      })
    },
    getBodyBindings(): QdsDialogBodyBindings {
      return normalize.element({
        className: dialogClasses.body,
        "data-size": size,
      })
    },
    getCloseButtonBindings(): QdsDialogCloseButtonBindings {
      return normalize.button({
        className: dialogClasses.closeButton,
      })
    },
    getContentBindings(): QdsDialogContentBindings {
      return normalize.element({
        className: dialogClasses.content,
        "data-scroll-behavior": scrollBehavior,
        "data-size": size,
      })
    },
    getFooterBindings(): QdsDialogFooterBindings {
      return normalize.element({
        className: dialogClasses.footer,
        "data-size": size,
      })
    },
    getHeadingBindings(): QdsDialogHeadingBindings {
      return normalize.element({
        className: dialogClasses.heading,
        "data-size": size,
      })
    },
    getIndicatorIconBindings(): QdsDialogIndicatorIconBindings {
      return normalize.element({
        className: dialogClasses.indicatorIcon,
        "data-emphasis": emphasis,
        "data-size": size,
      })
    },
    getPositionerBindings(): QdsDialogPositionerBindings {
      return normalize.element({
        className: dialogClasses.positioner,
        "data-placement": props.placement || "top",
        "data-scroll-behavior": scrollBehavior,
        "data-size": size,
      })
    },
  }
}
