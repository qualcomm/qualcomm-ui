// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {headerBarClasses} from "./header-bar.classes"

export type QdsHeaderBarSize = "sm" | "lg"

export type QdsHeaderSurface = "primary" | "secondary"

export interface QdsHeaderBarRootProps {
  /**
   * The size of the component and its elements. Governs padding, element spacing,
   * and height.
   *
   * @default 'sm'
   */
  size?: QdsHeaderBarSize

  /**
   * The background color of the component.
   */
  surface?: QdsHeaderSurface
}

type HeaderBarClasses = typeof headerBarClasses

export interface QdsHeaderBarRootBindings {
  className: HeaderBarClasses["root"]
  "data-size": QdsHeaderBarSize
  "data-surface": QdsHeaderSurface
}

export interface QdsHeaderBarLogoBindings {
  className: HeaderBarClasses["logo"]
}

export interface QdsHeaderBarActionBarBindings {
  className: HeaderBarClasses["actionBar"]
}

export interface QdsHeaderBarAppTitleBindings {
  className: HeaderBarClasses["appTitle"]
}

export interface QdsHeaderBarDividerBindings {
  className: HeaderBarClasses["divider"]
}

export interface QdsHeaderBarNavBindings {
  className: HeaderBarClasses["nav"]
}

export interface QdsHeaderBarNavItemBindings {
  "aria-current": "page" | undefined
  className: HeaderBarClasses["navItem"]
  "data-active": BooleanDataAttr
}

export interface QdsHeaderBarNavItemProps {
  /**
   * Whether the nav item is the current active route.
   */
  active?: boolean | undefined
}

export interface QdsHeaderBarWindowControlsBindings {
  className: HeaderBarClasses["windowControls"]
}

export interface QdsHeaderBarApi {
  getActionBarBindings(): QdsHeaderBarActionBarBindings
  getAppTitleBindings(): QdsHeaderBarAppTitleBindings
  getDividerBindings(): QdsHeaderBarDividerBindings
  getLogoBindings(): QdsHeaderBarLogoBindings
  getNavBindings(): QdsHeaderBarNavBindings
  getNavItemBindings(
    props?: QdsHeaderBarNavItemProps,
  ): QdsHeaderBarNavItemBindings
  getRootBindings(props: QdsHeaderBarRootProps): QdsHeaderBarRootBindings
  getWindowControlsBindings(): QdsHeaderBarWindowControlsBindings
}
