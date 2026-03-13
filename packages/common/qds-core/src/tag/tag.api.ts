// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tagClasses} from "./tag.classes"
import type {
  QdsTagApi,
  QdsTagApiProps,
  QdsTagDismissButtonBindings,
  QdsTagEndIconBindings,
  QdsTagRootBindings,
  QdsTagStartIconBindings,
} from "./tag.types"

export function createQdsTagApi(
  props: QdsTagApiProps,
  normalize: PropNormalizer,
): QdsTagApi {
  const size = props.size || "md"

  return {
    getDismissButtonBindings(): QdsTagDismissButtonBindings {
      return normalize.button({
        "aria-label": "Dismiss",
        className: tagClasses.dismissButton,
        "data-size": size,
        type: "button",
      })
    },
    getEndIconBindings(): QdsTagEndIconBindings {
      return normalize.element({
        className: tagClasses.icon,
        "data-part": "end-icon",
        "data-scope": "tag",
        "data-size": size,
      })
    },
    getRootBindings(): QdsTagRootBindings {
      return normalize.button({
        className: tagClasses.root,
        "data-emphasis": props.emphasis || "outline-brand",
        "data-radius": props.radius || "square",
        "data-size": size,
        "data-variant": props.variant,
      })
    },
    getStartIconBindings(): QdsTagStartIconBindings {
      return normalize.element({
        className: tagClasses.icon,
        "data-part": "start-icon",
        "data-scope": "tag",
        "data-size": size,
      })
    },
    isInteractiveVariant() {
      return props.variant === "link" || props.variant === "selectable"
    },
  }
}
