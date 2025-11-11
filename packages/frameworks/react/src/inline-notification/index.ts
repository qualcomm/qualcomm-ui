import {InlineNotification as SimpleInlineNotification} from "./inline-notification"
import {
  InlineNotificationActionContainer,
  type InlineNotificationActionContainerProps,
} from "./inline-notification-action-container"
import {
  InlineNotificationCloseButton,
  type InlineNotificationCloseButtonProps,
} from "./inline-notification-close-button"
import {
  InlineNotificationDescription,
  type InlineNotificationDescriptionProps,
} from "./inline-notification-description"
import {
  InlineNotificationIcon,
  type InlineNotificationIconProps,
} from "./inline-notification-icon"
import {
  InlineNotificationLabel,
  type InlineNotificationLabelProps,
} from "./inline-notification-label"
import {
  InlineNotificationRoot,
  type InlineNotificationRootProps,
} from "./inline-notification-root"

export * from "./qds-inline-notification-context"

export type {
  InlineNotificationActionContainerProps,
  InlineNotificationCloseButtonProps,
  InlineNotificationDescriptionProps,
  InlineNotificationIconProps,
  InlineNotificationLabelProps,
  InlineNotificationRootProps,
}

type InlineNotificationComponent = typeof SimpleInlineNotification & {
  /**
   * A container for the notification's primary action button. Renders a `<div>`
   * element by default.
   */
  ActionContainer: typeof InlineNotificationActionContainer
  /**
   * Closes the notification when clicked. Renders a `<button>` element by default.
   */
  CloseButton: typeof InlineNotificationCloseButton
  /**
   * A paragraph with additional information about the notification. Renders a
   * `<div>` element by default.
   */
  Description: typeof InlineNotificationDescription
  /**
   * An icon that indicates the notification's status. Renders a `<span>` element by
   * default.
   */
  Icon: typeof InlineNotificationIcon
  /**
   * A heading that labels the notification. Renders an `<div>` element by default.
   */
  Label: typeof InlineNotificationLabel
  /**
   * Groups all parts of the notification. Renders a `<div>` element by default.
   */
  Root: typeof InlineNotificationRoot
}

export const InlineNotification: InlineNotificationComponent =
  SimpleInlineNotification as InlineNotificationComponent

InlineNotification.ActionContainer = InlineNotificationActionContainer
InlineNotification.CloseButton = InlineNotificationCloseButton
InlineNotification.Description = InlineNotificationDescription
InlineNotification.Icon = InlineNotificationIcon
InlineNotification.Label = InlineNotificationLabel
InlineNotification.Root = InlineNotificationRoot
