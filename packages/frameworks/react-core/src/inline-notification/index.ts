import {
  CoreInlineNotificationDescription,
  type CoreInlineNotificationDescriptionProps,
  CoreInlineNotificationLabel,
  type CoreInlineNotificationLabelProps,
  CoreInlineNotificationRoot,
  type CoreInlineNotificationRootProps,
} from "./core-inline-notification"

export * from "./inline-notification-context"
export * from "./use-inline-notification"

export type {
  CoreInlineNotificationRootProps,
  CoreInlineNotificationLabelProps,
  CoreInlineNotificationDescriptionProps,
}

type CoreInlineNotificationComponent = {
  Description: typeof CoreInlineNotificationDescription
  Label: typeof CoreInlineNotificationLabel
  Root: typeof CoreInlineNotificationRoot
}

export const CoreInlineNotification: CoreInlineNotificationComponent = {
  Description: CoreInlineNotificationDescription,
  Label: CoreInlineNotificationLabel,
  Root: CoreInlineNotificationRoot,
}
