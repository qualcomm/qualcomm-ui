// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {notificationClasses} from "./inline-notification.classes"

export type QdsNotificationEmphasis =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "loading"

export type QdsNotificationOrientation = "horizontal" | "vertical"

export interface QdsNotificationApiProps {
  /**
   * Governs the color of the notification and its icon.
   *
   * @default 'info'
   */
  emphasis?: QdsNotificationEmphasis

  /**
   * The layout of the notification's elements.
   * @option `'horizontal'`: The icon, title, description, link, and close button are displayed inline.
   * @option `'vertical'`: The icon, title, and close button are placed on the first line, while the description, and link are stacked vertically and aligned with the title.
   *
   * @default 'horizontal'
   */
  orientation?: QdsNotificationOrientation
}

type NotificationClasses = typeof notificationClasses

export interface QdsNotificationRootBindings {
  className: NotificationClasses["root"]
  "data-emphasis": QdsNotificationEmphasis
  "data-orientation": QdsNotificationOrientation
}

export interface QdsNotificationIconBindings {
  className: NotificationClasses["icon"]
}

export interface QdsNotificationLabelBindings {
  className: NotificationClasses["label"]
}

export interface QdsNotificationDescriptionBindings {
  className: NotificationClasses["description"]
}

export interface QdsNotificationActionBindings {
  className: NotificationClasses["action"]
  "data-orientation": QdsNotificationOrientation
}

export interface QdsNotificationCloseButtonBindings {
  className: NotificationClasses["closeButton"]
}

export interface QdsNotificationApi {
  emphasis: QdsNotificationEmphasis
  orientation: QdsNotificationOrientation

  // group: bindings
  getActionBindings(): QdsNotificationActionBindings
  getCloseButtonBindings(): QdsNotificationCloseButtonBindings
  getDescriptionBindings(): QdsNotificationDescriptionBindings
  getHeadingBindings(): QdsNotificationLabelBindings
  getIconBindings(): QdsNotificationIconBindings
  getRootBindings(): QdsNotificationRootBindings
}
