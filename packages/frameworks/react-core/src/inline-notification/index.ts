import {
  CoreInlineNotificationDescription,
  type CoreInlineNotificationDescriptionProps,
  CoreInlineNotificationLabel,
  type CoreInlineNotificationLabelProps,
  CoreInlineNotificationRoot,
  type CoreInlineNotificationRootProps,
} from "./core-inline-notification.js"

export * from "./inline-notification-context.js"
export * from "./use-inline-notification.js"

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
