// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {popoverClasses} from "./popover.classes.js"
import type {
  QdsPopoverApi,
  QdsPopoverApiProps,
  QdsPopoverArrowBindings,
  QdsPopoverContentBindings,
} from "./popover.types.js"

export function createQdsPopoverApi(
  props: Explicit<QdsPopoverApiProps>,
  normalize: PropNormalizer,
): QdsPopoverApi {
  const emphasis = props.emphasis || "neutral"

  return {
    emphasis,

    getArrowBindings(): QdsPopoverArrowBindings {
      return normalize.element({
        className: popoverClasses.arrow,
        "data-emphasis": emphasis,
      })
    },
    getContentBindings(): QdsPopoverContentBindings {
      return normalize.element({
        className: popoverClasses.content,
        "data-emphasis": emphasis,
      })
    },
  }
}
