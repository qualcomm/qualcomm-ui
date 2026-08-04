// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {badgeClasses} from "./badge.classes.js"
import {iconBadgeAnatomy} from "./icon-badge.anatomy.js"
import type {
  QdsIconBadgeApi,
  QdsIconBadgeIconBindings,
  QdsIconBadgeProps,
  QdsIconBadgeRootBindings,
} from "./icon-badge.types.js"

const parts = iconBadgeAnatomy.parts

export function createQdsIconBadgeApi(
  props: QdsIconBadgeProps,
  normalize: PropNormalizer,
): QdsIconBadgeApi {
  const size = props.size || "md"
  return {
    getIconBindings(): QdsIconBadgeIconBindings {
      return normalize.element({
        ...parts.icon,
        className: badgeClasses.icon,
        "data-size": size,
      })
    },
    getRootBindings(): QdsIconBadgeRootBindings {
      return normalize.element({
        ...parts.root,
        className: badgeClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": props.emphasis || "neutral",
        "data-size": size,
        "data-variant": props.variant || "default",
      })
    },
  }
}
