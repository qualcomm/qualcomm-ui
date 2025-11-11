// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {InlineNotificationCloseTriggerBindings} from "@qualcomm-ui/core/inline-notification"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useInlineNotificationContext} from "./inline-notification-context"

export function useInlineNotificationCloseTrigger({
  id,
}: IdProp): InlineNotificationCloseTriggerBindings {
  const context = useInlineNotificationContext()

  return context.getCloseTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
