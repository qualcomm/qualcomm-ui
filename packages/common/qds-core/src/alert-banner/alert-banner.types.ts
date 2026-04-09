// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DirectionProperty} from "@qualcomm-ui/utils/direction"

import type {alertBannerClasses} from "./alert-banner.classes"

export type QdsAlertBannerEmphasis =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"

export type QdsAlertBannerVariant = "strong" | "subtle"

export interface QdsAlertBannerApiProps extends DirectionProperty {
  /**
   * Accessible label for the close button.
   *
   * @default 'Close'
   */
  closeButtonAriaLabel?: string

  /**
   * Governs the color of the banner and its icon.
   *
   * @default 'info'
   */
  emphasis?: QdsAlertBannerEmphasis

  /**
   * The visual style of the banner.
   *
   * @default 'strong'
   */
  variant?: QdsAlertBannerVariant
}

type AlertBannerClasses = typeof alertBannerClasses

export interface QdsAlertBannerCommonBindings {
  "data-scope": "alert-banner"
}

export interface QdsAlertBannerRootBindings
  extends QdsAlertBannerCommonBindings,
    Required<DirectionProperty> {
  className: AlertBannerClasses["root"]
  "data-emphasis": QdsAlertBannerEmphasis
  "data-part": "root"
  "data-variant": QdsAlertBannerVariant
  role: "alert" | "status"
}

export interface QdsAlertBannerIconBindings
  extends QdsAlertBannerCommonBindings {
  className: AlertBannerClasses["icon"]
  "data-part": "status-icon"
}

export interface QdsAlertBannerHeadingBindings
  extends QdsAlertBannerCommonBindings {
  className: AlertBannerClasses["heading"]
  "data-part": "heading"
}

export interface QdsAlertBannerDescriptionBindings
  extends QdsAlertBannerCommonBindings {
  className: AlertBannerClasses["description"]
  "data-part": "description"
}

export interface QdsAlertBannerActionBindings
  extends QdsAlertBannerCommonBindings {
  className: AlertBannerClasses["action"]
  "data-part": "action"
}

export interface QdsAlertBannerCloseButtonBindings
  extends QdsAlertBannerCommonBindings {
  "aria-label": string
  className: AlertBannerClasses["closeButton"]
  "data-part": "close-button"
}

export type QdsAlertBannerCloseButtonEmphasis =
  | "black-persistent"
  | "inverse"
  | "neutral"

export interface QdsAlertBannerApi {
  closeButtonEmphasis: QdsAlertBannerCloseButtonEmphasis
  emphasis: QdsAlertBannerEmphasis
  variant: QdsAlertBannerVariant

  // group: bindings
  getActionBindings(): QdsAlertBannerActionBindings
  getCloseButtonBindings(): QdsAlertBannerCloseButtonBindings
  getDescriptionBindings(): QdsAlertBannerDescriptionBindings
  getHeadingBindings(): QdsAlertBannerHeadingBindings
  getIconBindings(): QdsAlertBannerIconBindings
  getRootBindings(): QdsAlertBannerRootBindings
}
