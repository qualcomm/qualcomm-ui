// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {sideNavClasses} from "./side-nav.classes"
import type {
  QdsSideNavApi,
  QdsSideNavBranchBindings,
  QdsSideNavBranchContentBindings,
  QdsSideNavBranchIndentGuideBindings,
  QdsSideNavBranchNodeBindings,
  QdsSideNavBranchTriggerBindings,
  QdsSideNavCollapseTriggerBindings,
  QdsSideNavDividerBindings,
  QdsSideNavFilterInputBindings,
  QdsSideNavGroupBindings,
  QdsSideNavGroupLabelBindings,
  QdsSideNavHeaderActionBindings,
  QdsSideNavHeaderBindings,
  QdsSideNavHeaderLogoBindings,
  QdsSideNavHeaderTitleBindings,
  QdsSideNavLeafNodeBindings,
  QdsSideNavNodeAccessoryBindings,
  QdsSideNavNodeActionBindings,
  QdsSideNavNodeIconBindings,
  QdsSideNavNodeIndicatorBindings,
  QdsSideNavRootBindings,
  QdsSideNavRootProps,
} from "./side-nav.types"

export function createQdsSideNavApi(normalize: PropNormalizer): QdsSideNavApi {
  return {
    // group: bindings
    getBranchBindings(): QdsSideNavBranchBindings {
      return normalize.element({
        className: sideNavClasses.branch,
      })
    },
    getBranchContentBindings(): QdsSideNavBranchContentBindings {
      return normalize.element({
        className: sideNavClasses.branchContent,
      })
    },
    getBranchIndentGuideBindings(): QdsSideNavBranchIndentGuideBindings {
      return normalize.element({
        className: sideNavClasses.branchIndentGuide,
      })
    },
    getBranchNodeBindings(): QdsSideNavBranchNodeBindings {
      return normalize.element({
        className: sideNavClasses.nodeRoot,
      })
    },
    getBranchTriggerBindings(): QdsSideNavBranchTriggerBindings {
      return normalize.element({
        className: sideNavClasses.branchTrigger,
      })
    },
    getCollapseTriggerBindings(): QdsSideNavCollapseTriggerBindings {
      return normalize.element({
        className: sideNavClasses.collapseTrigger,
      })
    },
    getDividerBindings(): QdsSideNavDividerBindings {
      return normalize.element({
        className: sideNavClasses.divider,
      })
    },
    getFilterInputBindings(): QdsSideNavFilterInputBindings {
      return normalize.element({
        className: sideNavClasses.filterInput,
      })
    },
    getGroupBindings(): QdsSideNavGroupBindings {
      return normalize.element({
        className: sideNavClasses.group,
      })
    },
    getGroupLabelBindings(): QdsSideNavGroupLabelBindings {
      return normalize.element({
        className: sideNavClasses.groupLabel,
      })
    },
    getHeaderActionBindings(): QdsSideNavHeaderActionBindings {
      return normalize.element({
        className: sideNavClasses.headerAction,
      })
    },
    getHeaderBindings(): QdsSideNavHeaderBindings {
      return normalize.element({
        className: sideNavClasses.header,
      })
    },
    getHeaderLogoBindings(): QdsSideNavHeaderLogoBindings {
      return normalize.element({
        className: sideNavClasses.headerLogo,
      })
    },
    getHeaderTitleBindings(): QdsSideNavHeaderTitleBindings {
      return normalize.element({
        className: sideNavClasses.headerTitle,
      })
    },
    getLeafNodeBindings(): QdsSideNavLeafNodeBindings {
      return normalize.element({
        className: sideNavClasses.nodeRoot,
      })
    },
    getNodeAccessoryBindings(): QdsSideNavNodeAccessoryBindings {
      return normalize.element({
        className: sideNavClasses.nodeAccessory,
      })
    },
    getNodeActionBindings(): QdsSideNavNodeActionBindings {
      return normalize.element({
        className: sideNavClasses.nodeAction,
      })
    },
    getNodeIconBindings(): QdsSideNavNodeIconBindings {
      return normalize.element({
        className: sideNavClasses.nodeIcon,
      })
    },
    getNodeIndicatorBindings(): QdsSideNavNodeIndicatorBindings {
      return normalize.element({
        className: sideNavClasses.nodeIndicator,
      })
    },
    getRootBindings(props: QdsSideNavRootProps): QdsSideNavRootBindings {
      return normalize.element({
        className: sideNavClasses.root,
        "data-surface": props.surface || "primary",
      })
    },
  }
}
