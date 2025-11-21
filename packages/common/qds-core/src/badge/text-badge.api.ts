// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {badgeClasses} from "./badge.classes"
import type {
  QdsTextBadgeApi,
  QdsTextBadgeProps,
  QdsTextBadgeRootBindings,
} from "./text-badge.types"

export function createQdsTextBadgeApi(
  props: QdsTextBadgeProps,
  normalize: PropNormalizer,
): QdsTextBadgeApi {
  return {
    getRootBindings(): QdsTextBadgeRootBindings {
      return normalize.element({
        className: badgeClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": props.emphasis || "neutral",
        "data-part": "root",
        "data-scope": "text-badge",
        "data-size": props.size || "md",
        "data-variant": props.variant || "default",
      })
    },
  }
}
