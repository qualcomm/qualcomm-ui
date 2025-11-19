// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {actionGroupClasses} from "./action-group.classes"

export interface QdsActionGroupRootBindings {
  className: (typeof actionGroupClasses)["root"]
  "data-part": "root"
  "data-scope": "action-group"
}
