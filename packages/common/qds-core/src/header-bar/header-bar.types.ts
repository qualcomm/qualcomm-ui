// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {headerBarAnatomy} from "./header-bar.anatomy"
import type {headerBarClasses} from "./header-bar.classes"

export type QdsHeaderBarSize = "sm" | "lg"

export type QdsHeaderSurface = "primary" | "secondary"

export type QdsHeaderBarPadding = "default" | "large"

export interface QdsHeaderBarRootProps {
  /**
   * The horizontal padding of the component.
   *
   * @default 'default'
   */
  padding?: QdsHeaderBarPadding

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

type PartName = AnatomyPartName<typeof headerBarAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"headerBar", P> {}

export interface QdsHeaderBarRootBindings extends Part<"root"> {
  className: HeaderBarClasses["root"]
  "data-padding": QdsHeaderBarPadding
  "data-size": QdsHeaderBarSize
  "data-surface": QdsHeaderSurface
}

export interface QdsHeaderBarLogoBindings extends Part<"logo"> {
  className: HeaderBarClasses["logo"]
}

export interface QdsHeaderBarActionBarBindings extends Part<"actionBar"> {
  className: HeaderBarClasses["actionBar"]
}

export interface QdsHeaderBarAppTitleBindings extends Part<"appTitle"> {
  className: HeaderBarClasses["appTitle"]
}

export interface QdsHeaderBarDividerBindings extends Part<"divider"> {
  className: HeaderBarClasses["divider"]
}

export interface QdsHeaderBarNavBindings extends Part<"nav"> {
  className: HeaderBarClasses["nav"]
}

export interface QdsHeaderBarNavItemBindings extends Part<"navItem"> {
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

export interface QdsHeaderBarWindowControlsBindings extends Part<"windowControls"> {
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
