// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {InlineNotificationApiProps} from "./inline-notification.types"

export const inlineNotificationProps: (keyof InlineNotificationApiProps)[] =
  createProps<InlineNotificationApiProps>()(
    "dir",
    "getRootNode",
    "onDismiss",
    "role",
  )

export const splitInlineNotificationProps: <
  Props extends InlineNotificationApiProps,
>(
  props: Props,
) => [
  InlineNotificationApiProps,
  Omit<Props, keyof InlineNotificationApiProps>,
] = createSplitProps<InlineNotificationApiProps>(inlineNotificationProps)
