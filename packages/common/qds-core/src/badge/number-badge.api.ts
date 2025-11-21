// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {badgeClasses} from "./badge.classes"
import type {
  QdsNumberBadgeApi,
  QdsNumberBadgeProps,
  QdsNumberBadgeRootBindings,
} from "./number-badge.types"

export function createQdsNumberBadgeApi(
  props: QdsNumberBadgeProps,
  normalize: PropNormalizer,
): QdsNumberBadgeApi {
  let overflow = false
  let displayValue: number | string | null = null

  if (props.value != null) {
    const max = props.max ?? 99
    overflow = props.value > max
    displayValue = overflow ? `${max}+` : props.value
  }

  return {
    displayValue,
    getRootBindings(): QdsNumberBadgeRootBindings {
      return normalize.element({
        className: badgeClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": props.emphasis || "neutral",
        "data-overflow": booleanDataAttr(overflow),
        "data-part": "root",
        "data-scope": "number-badge",
        "data-size": props.size || "md",
      })
    },
  }
}
