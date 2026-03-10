// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
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
  props: QdsTagApiProps & {selected?: boolean | undefined},
  normalize: PropNormalizer,
): QdsTagApi {
  const size = props.size || "md"

  return {
    getDismissButtonBindings(): QdsTagDismissButtonBindings {
      return normalize.button({
        "aria-label": "Dismiss",
        className: tagClasses.dismissButton,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-part": "dismiss-button",
        "data-scope": "tag",
        "data-size": size,
        disabled: props.disabled,
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
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": props.emphasis || "outline-brand",
        "data-part": "root" as const,
        "data-radius": props.radius || "square",
        "data-scope": "tag" as const,
        "data-selected": booleanDataAttr(props.selected),
        "data-size": size,
        "data-variant": props.variant,
        disabled: props.disabled,
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
