// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  InlineNotificationElementIds,
  InlineNotificationScope,
} from "../inline-notification.types"

export const domIds: ScopeDomIds<
  InlineNotificationElementIds,
  InlineNotificationScope
> = {
  closeTrigger: (scope) => scope.ids.get("closeTrigger"),
  description: (scope) => scope.ids.get("description"),
  heading: (scope) => scope.ids.get("heading"),
  root: (scope) => scope.ids.get("root"),
}
