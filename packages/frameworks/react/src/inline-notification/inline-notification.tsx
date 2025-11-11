// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"

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

export interface InlineNotificationProps
  extends Omit<InlineNotificationRootProps, "children"> {
  /**
   * The component used for the content of the action element.
   */
  action?: ReactNode

  /**
   * Props applied to the action container element.
   * @inheritDoc
   */
  actionProps?: InlineNotificationActionContainerProps

  /**
   * The simple InlineNotification doesn't support children.
   */
  children?: never

  /**
   * Props applied to the close button element.
   * @inheritDoc
   */
  closeButtonProps?: InlineNotificationCloseButtonProps

  /**
   * Optional description text for the notification.
   */
  description?: ReactNode

  /**
   * Props applied to the description element.
   * @inheritDoc
   */
  descriptionProps?: InlineNotificationDescriptionProps

  /**
   * When `true`, renders a close button that dismisses the notification on click.
   *
   * @default false
   */
  dismissable?: boolean

  /**
   * Override the icon displayed in the notification. When this prop is omitted,
   * the icon is determined by the {@link emphasis} prop.
   */
  icon?: LucideIconOrNode

  /**
   * Props applied to the icon element.
   * @inheritDoc
   */
  iconProps?: InlineNotificationIconProps

  /**
   * Optional heading text for the notification.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   * @inheritDoc
   */
  labelProps?: InlineNotificationLabelProps
}

export function InlineNotification({
  action,
  actionProps,
  closeButtonProps,
  description,
  descriptionProps,
  dismissable,
  icon,
  iconProps,
  label,
  labelProps,
  ...props
}: InlineNotificationProps): ReactElement {
  const headingContent = label || labelProps?.children
  const descriptionContent = description || descriptionProps?.children
  const actionContent = action || actionProps?.children

  return (
    <InlineNotificationRoot {...props}>
      <InlineNotificationIcon icon={icon} {...iconProps} />

      {headingContent ? (
        <InlineNotificationLabel {...labelProps}>
          {headingContent}
        </InlineNotificationLabel>
      ) : null}

      {descriptionContent ? (
        <InlineNotificationDescription {...descriptionProps}>
          {descriptionContent}
        </InlineNotificationDescription>
      ) : null}

      {actionContent ? (
        <InlineNotificationActionContainer {...actionProps}>
          {actionContent}
        </InlineNotificationActionContainer>
      ) : null}

      {dismissable ? (
        <InlineNotificationCloseButton {...closeButtonProps} />
      ) : null}
    </InlineNotificationRoot>
  )
}
