// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tagAnatomy} from "./tag.anatomy.js"
import {tagClasses} from "./tag.classes.js"
import type {
  QdsTagApi,
  QdsTagApiProps,
  QdsTagCommonRootBindings,
  QdsTagDismissButtonBindings,
  QdsTagEndIconBindings,
  QdsTagRootBindings,
  QdsTagStartIconBindings,
} from "./tag.types.js"

const parts = tagAnatomy.parts

export function createQdsTagApi(
  props: QdsTagApiProps & {
    active?: boolean | undefined
    selected?: boolean | undefined
  },
  normalize: PropNormalizer,
): QdsTagApi {
  const size = props.size || "md"
  const selected = props.variant === "selectable" && props.selected
  const active = Boolean(props.active && props.variant == null)

  function isInteractiveVariant(): boolean {
    return props.variant === "link" || props.variant === "selectable"
  }

  const commonBindings: QdsTagCommonRootBindings = {
    ...parts.root,
    "aria-disabled": booleanAriaAttr(props.disabled, null),
    className: tagClasses.root,
    "data-disabled": booleanDataAttr(props.disabled),
    "data-emphasis": props.emphasis || "outline-brand",
    "data-selected": booleanDataAttr(selected),
    "data-shape": props.shape || props.radius || "square",
    "data-size": size,
    "data-variant": props.variant,
    tabIndex: props.disabled ? -1 : undefined,
  }

  return {
    getDismissButtonBindings(): QdsTagDismissButtonBindings {
      return normalize.button({
        ...parts.dismissButton,
        "aria-label": props.dismissLabel || "Dismiss",
        className: tagClasses.dismissButton,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-size": size,
        disabled: props.disabled,
        type: "button",
      })
    },
    getEndIconBindings(): QdsTagEndIconBindings {
      return normalize.element({
        ...parts.endIcon,
        className: tagClasses.icon,
      })
    },
    getRootBindings(): QdsTagRootBindings {
      if (!isInteractiveVariant()) {
        return normalize.element({
          ...commonBindings,
          "data-active": booleanDataAttr(active),
        })
      }
      return normalize.button({
        ...commonBindings,
        "aria-pressed":
          props.variant === "selectable"
            ? booleanAriaAttr(selected)
            : undefined,
      })
    },
    getStartIconBindings(): QdsTagStartIconBindings {
      return normalize.element({
        ...parts.startIcon,
        className: tagClasses.icon,
      })
    },
    isInteractiveVariant,
  }
}
