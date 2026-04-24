// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart} from "@qualcomm-ui/utils/anatomy"

import type {actionGroupClasses} from "./action-group.classes"

export interface QdsActionGroupRootBindings extends AnatomyPart<
  "actionGroup",
  "root"
> {
  className: (typeof actionGroupClasses)["root"]
}
