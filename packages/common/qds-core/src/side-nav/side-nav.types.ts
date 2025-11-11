// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {sideNavClasses} from "./side-nav.classes"

export type QdsSideNavSurface = "primary" | "secondary"

export interface QdsSideNavRootProps {
  /**
   * The background color of the side navigation.
   *
   * @default 'primary'
   */
  surface?: QdsSideNavSurface
}

type SideNavClasses = typeof sideNavClasses

export interface QdsSideNavRootBindings {
  className: SideNavClasses["root"]
  "data-surface": QdsSideNavSurface
}

export interface QdsSideNavHeaderBindings {
  className: SideNavClasses["header"]
}

export interface QdsSideNavHeaderTitleBindings {
  className: SideNavClasses["headerTitle"]
}

export interface QdsSideNavHeaderLogoBindings {
  className: SideNavClasses["headerLogo"]
}

export interface QdsSideNavHeaderActionBindings {
  className: SideNavClasses["headerAction"]
}

export interface QdsSideNavGroupBindings {
  className: SideNavClasses["group"]
}

export interface QdsSideNavGroupLabelBindings {
  className: SideNavClasses["groupLabel"]
}

export interface QdsSideNavDividerBindings {
  className: SideNavClasses["divider"]
}

export interface QdsSideNavBranchBindings {
  className: SideNavClasses["branch"]
}

export interface QdsSideNavBranchContentBindings {
  className: SideNavClasses["branchContent"]
}

export interface QdsSideNavBranchNodeBindings {
  className: SideNavClasses["nodeRoot"]
}

export interface QdsSideNavBranchIndentGuideBindings {
  className: SideNavClasses["branchIndentGuide"]
}

export interface QdsSideNavBranchTriggerBindings {
  className: SideNavClasses["branchTrigger"]
}

export interface QdsSideNavLeafNodeBindings {
  className: SideNavClasses["nodeRoot"]
}

export interface QdsSideNavNodeIndicatorBindings {
  className: SideNavClasses["nodeIndicator"]
}

export interface QdsSideNavNodeActionBindings {
  className: SideNavClasses["nodeAction"]
}

export interface QdsSideNavNodeIconBindings {
  className: SideNavClasses["nodeIcon"]
}

export interface QdsSideNavNodeAccessoryBindings {
  className: SideNavClasses["nodeAccessory"]
}

export interface QdsSideNavCollapseTriggerBindings {
  className: SideNavClasses["collapseTrigger"]
}

export interface QdsSideNavFilterInputBindings {
  className: SideNavClasses["filterInput"]
}

export interface QdsSideNavApi {
  // group: bindings
  getBranchBindings(): QdsSideNavBranchBindings
  getBranchContentBindings(): QdsSideNavBranchContentBindings
  getBranchIndentGuideBindings(): QdsSideNavBranchIndentGuideBindings
  getBranchNodeBindings(): QdsSideNavBranchNodeBindings
  getBranchTriggerBindings(): QdsSideNavBranchTriggerBindings
  getCollapseTriggerBindings(): QdsSideNavCollapseTriggerBindings
  getDividerBindings(): QdsSideNavDividerBindings
  getFilterInputBindings(): QdsSideNavFilterInputBindings
  getGroupBindings(): QdsSideNavGroupBindings
  getGroupLabelBindings(): QdsSideNavGroupLabelBindings
  getHeaderActionBindings(): QdsSideNavHeaderActionBindings
  getHeaderBindings(): QdsSideNavHeaderBindings
  getHeaderLogoBindings(): QdsSideNavHeaderLogoBindings
  getHeaderTitleBindings(): QdsSideNavHeaderTitleBindings
  getLeafNodeBindings(): QdsSideNavLeafNodeBindings
  getNodeAccessoryBindings(): QdsSideNavNodeAccessoryBindings
  getNodeActionBindings(): QdsSideNavNodeActionBindings
  getNodeIconBindings(): QdsSideNavNodeIconBindings
  getNodeIndicatorBindings(): QdsSideNavNodeIndicatorBindings
  getRootBindings(props: QdsSideNavRootProps): QdsSideNavRootBindings
}
