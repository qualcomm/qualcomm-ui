// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {badgeClasses} from "./badge.classes"
import type {
  QdsIconBadgeApi,
  QdsIconBadgeIconBindings,
  QdsIconBadgeProps,
  QdsIconBadgeRootBindings,
} from "./icon-badge.types"

export function createQdsIconBadgeApi(
  props: QdsIconBadgeProps,
  normalize: PropNormalizer,
): QdsIconBadgeApi {
  const size = props.size || "md"
  return {
    getIconBindings(): QdsIconBadgeIconBindings {
      return normalize.element({
        className: badgeClasses.icon,
        "data-part": "icon",
        "data-scope": "icon-badge",
        "data-size": size,
      })
    },
    getRootBindings(): QdsIconBadgeRootBindings {
      return normalize.element({
        className: badgeClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": props.emphasis || "neutral",
        "data-overflow": booleanDataAttr(false),
        "data-part": "root",
        "data-scope": "icon-badge",
        "data-size": size,
        "data-variant": props.variant || "default",
      })
    },
  }
}
