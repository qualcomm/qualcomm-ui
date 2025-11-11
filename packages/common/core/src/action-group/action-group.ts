// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface ActionGroupRootBindings {
  "data-part": "root"
  "data-scope": "action-group"
}

export function getActionGroupRootBindings(): ActionGroupRootBindings {
  return {
    "data-part": "root",
    "data-scope": "action-group",
  }
}
