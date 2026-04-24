// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {inlineIconButtonAnatomy} from "./inline-icon-button.anatomy"
import {inlineIconButtonClasses} from "./inline-icon-button.classes"
import type {
  QdsInlineIconButtonApi,
  QdsInlineIconButtonApiProps,
  QdsInlineIconButtonIconBindings,
  QdsInlineIconButtonRootBindings,
} from "./inline-icon-button.types"

const parts = inlineIconButtonAnatomy.parts

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
        ...parts.icon,
        className: inlineIconButtonClasses.icon,
        "data-emphasis": emphasis,
        "data-size": size,
        "data-variant": variant,
      })
    },
    getRootBindings(): QdsInlineIconButtonRootBindings {
      return normalize.button({
        ...parts.root,
        className: inlineIconButtonClasses.root,
        "data-emphasis": emphasis,
        "data-size": size,
        "data-variant": variant,
      })
    },
  }
}
