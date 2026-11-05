// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {actionGroupAnatomy} from "@qualcomm-ui/core/action-group"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {actionGroupClasses} from "./action-group.classes.js"
import type {QdsActionGroupRootBindings} from "./action-group.types.js"

export function getActionGroupRootBindings(
  normalizeProps: PropNormalizer,
): QdsActionGroupRootBindings {
  return normalizeProps.element({
    ...actionGroupAnatomy.parts.root,
    className: actionGroupClasses.root,
  })
}
