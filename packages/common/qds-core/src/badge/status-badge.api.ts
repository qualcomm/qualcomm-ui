// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {badgeClasses} from "./badge.classes"
import type {
  QdsStatusBadgeApi,
  QdsStatusBadgeProps,
  QdsStatusBadgeRootBindings,
} from "./status-badge.types"

export function createQdsStatusBadgeApi(
  props: QdsStatusBadgeProps,
  normalize: PropNormalizer,
): QdsStatusBadgeApi {
  return {
    getRootBindings(): QdsStatusBadgeRootBindings {
      return normalize.element({
        className: badgeClasses.root,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-emphasis": props.emphasis || "neutral",
        "data-overflow": booleanDataAttr(false),
        "data-part": "root",
        "data-scope": "status-badge",
        "data-size": props.size || "md",
        "data-variant": props.variant || "filled",
      })
    },
  }
}
