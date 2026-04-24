// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart} from "@qualcomm-ui/utils/anatomy"

import {actionGroupAnatomy} from "./action-group.anatomy"

/**
 * @deprecated
 */
export interface ActionGroupRootBindings extends AnatomyPart<
  "actionGroup",
  "root"
> {}

/**
 * @deprecated
 */
export function getActionGroupRootBindings(): ActionGroupRootBindings {
  return actionGroupAnatomy.parts.root
}
