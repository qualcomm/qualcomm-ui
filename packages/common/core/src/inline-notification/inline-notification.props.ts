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
