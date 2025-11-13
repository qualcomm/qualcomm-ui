// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {badgeClasses} from "./badge.classes"
import type {
  QdsBadgeApi,
  QdsBadgeApiProps,
  QdsBadgeCountProps,
  QdsBadgeIconBindings,
  QdsBadgeIconProps,
  QdsBadgeRootBindings,
  QdsBadgeStatusProps,
  QdsBadgeTextProps,
} from "./badge.types"

export function createQdsBadgeApi(
  props: QdsBadgeApiProps,
  normalize: PropNormalizer,
): QdsBadgeApi {
  const type = props.type || "text"
  const size = props.size || "md"

  let emphasis: string | undefined
  let variant: string | undefined
  let overflow = false
  let displayCount: number | string | null = null

  if (type === "count") {
    const countProps = props as QdsBadgeCountProps
    variant = countProps.variant || "neutral"
    if (countProps.count != null) {
      const max = countProps.max ?? 99
      overflow = countProps.count > max
      displayCount = overflow ? `${max}+` : countProps.count
    }
  } else if (type === "status") {
    emphasis = (props as QdsBadgeStatusProps).emphasis || "neutral"
    variant = (props as QdsBadgeStatusProps).variant || "filled"
  } else if (type === "icon") {
    emphasis = (props as QdsBadgeIconProps).emphasis || "neutral"
    variant = (props as QdsBadgeIconProps).variant || "default"
  } else {
    emphasis = (props as QdsBadgeTextProps).emphasis || "neutral"
    variant = (props as QdsBadgeTextProps).variant || "default"
  }

  return {
    getDisplayCount(): number | string | null {
      return displayCount
    },
    getIconBindings(): QdsBadgeIconBindings {
      return normalize.element({
        className: badgeClasses.icon,
        "data-part": "icon",
        "data-scope": "badge",
        "data-size": size,
      })
    },
    getRootBindings(): QdsBadgeRootBindings {
      return normalize.element({
        className: badgeClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": emphasis,
        "data-overflow": booleanDataAttr(overflow),
        "data-part": "root",
        "data-scope": "badge",
        "data-size": size,
        "data-type": type,
        "data-variant": variant,
      })
    },
    type,
  }
}
