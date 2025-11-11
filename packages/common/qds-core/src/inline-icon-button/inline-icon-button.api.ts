// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {inlineIconButtonClasses} from "./inline-icon-button.classes"
import type {
  QdsInlineIconButtonApi,
  QdsInlineIconButtonApiProps,
  QdsInlineIconButtonIconBindings,
  QdsInlineIconButtonRootBindings,
} from "./inline-icon-button.types"

export function createQdsInlineIconButtonApi(
  props: Explicit<QdsInlineIconButtonApiProps>,
  normalize: PropNormalizer,
): QdsInlineIconButtonApi {
  const size = props.size || "md"
  const emphasis = props.emphasis || "neutral"
  const variant = props.variant || "fixed"

  return {
    emphasis,
    size,
    variant,

    // group: prop getters
    getIconBindings(): QdsInlineIconButtonIconBindings {
      return normalize.element({
        className: inlineIconButtonClasses.icon,
        "data-emphasis": emphasis,
        "data-part": "icon",
        "data-scope": "inline-icon-button",
        "data-size": size,
        "data-variant": variant,
      })
    },
    getRootBindings(): QdsInlineIconButtonRootBindings {
      return normalize.button({
        className: inlineIconButtonClasses.root,
        "data-emphasis": emphasis,
        "data-scope": "inline-icon-button",
        "data-size": size,
        "data-variant": variant,
      })
    },
  }
}
