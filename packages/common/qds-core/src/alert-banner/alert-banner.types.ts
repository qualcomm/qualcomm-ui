// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"

import type {alertBannerAnatomy} from "./alert-banner.anatomy"
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

type PartName = AnatomyPartName<typeof alertBannerAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"alertBanner", P> {}

export interface QdsAlertBannerRootBindings
  extends Part<"root">, Required<DirectionProperty> {
  className: AlertBannerClasses["root"]
  "data-emphasis": QdsAlertBannerEmphasis
  "data-variant": QdsAlertBannerVariant
  role: "alert" | "status"
}

export interface QdsAlertBannerIconBindings extends Part<"statusIcon"> {
  className: AlertBannerClasses["icon"]
}

export interface QdsAlertBannerHeadingBindings extends Part<"heading"> {
  className: AlertBannerClasses["heading"]
}

export interface QdsAlertBannerDescriptionBindings extends Part<"description"> {
  className: AlertBannerClasses["description"]
}

export interface QdsAlertBannerActionBindings extends Part<"action"> {
  className: AlertBannerClasses["action"]
}

export interface QdsAlertBannerCloseButtonBindings extends Part<"closeButton"> {
  "aria-label": string
  className: AlertBannerClasses["closeButton"]
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
