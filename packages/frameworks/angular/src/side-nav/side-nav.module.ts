// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {SideNavBranchContentDirective} from "./side-nav-branch-content.directive"
import {SideNavBranchIndentGuideDirective} from "./side-nav-branch-indent-guide.directive"
import {SideNavBranchNodeDirective} from "./side-nav-branch-node.directive"
import {SideNavBranchTemplateDirective} from "./side-nav-branch-template.directive"
import {SideNavBranchTriggerDirective} from "./side-nav-branch-trigger.directive"
import {SideNavBranchDirective} from "./side-nav-branch.directive"
import {SideNavCollapseTriggerDirective} from "./side-nav-collapse-trigger.directive"
import {SideNavDividerDirective} from "./side-nav-divider.directive"
import {SideNavFilterInputDirective} from "./side-nav-filter-input.directive"
import {SideNavGroupLabelDirective} from "./side-nav-group-label.directive"
import {SideNavGroupDirective} from "./side-nav-group.directive"
import {SideNavHeaderActionDirective} from "./side-nav-header-action.directive"
import {SideNavHeaderLogoDirective} from "./side-nav-header-logo.directive"
import {SideNavHeaderTitleDirective} from "./side-nav-header-title.directive"
import {SideNavHeaderDirective} from "./side-nav-header.directive"
import {SideNavLeafNodeDirective} from "./side-nav-leaf-node.directive"
import {SideNavLeafTemplateDirective} from "./side-nav-leaf-template.directive"
import {SideNavNodeAccessoryDirective} from "./side-nav-node-accessory.directive"
import {SideNavNodeActionDirective} from "./side-nav-node-action.directive"
import {SideNavNodeContextDirective} from "./side-nav-node-context.directive"
import {SideNavNodeIconDirective} from "./side-nav-node-icon.directive"
import {SideNavNodeIndicatorDirective} from "./side-nav-node-indicator.directive"
import {SideNavNodeTextDirective} from "./side-nav-node-text.directive"
import {SideNavNodesComponent} from "./side-nav-nodes.component"
import {SideNavRootDirective} from "./side-nav-root.directive"

@NgModule({
  declarations: [
    SideNavRootDirective,
    SideNavBranchDirective,
    SideNavBranchContentDirective,
    SideNavBranchIndentGuideDirective,
    SideNavBranchNodeDirective,
    SideNavBranchTriggerDirective,
    SideNavBranchTemplateDirective,
    SideNavCollapseTriggerDirective,
    SideNavDividerDirective,
    SideNavFilterInputDirective,
    SideNavGroupDirective,
    SideNavGroupLabelDirective,
    SideNavHeaderDirective,
    SideNavHeaderActionDirective,
    SideNavHeaderLogoDirective,
    SideNavHeaderTitleDirective,
    SideNavLeafNodeDirective,
    SideNavLeafTemplateDirective,
    SideNavNodeAccessoryDirective,
    SideNavNodeActionDirective,
    SideNavNodeContextDirective,
    SideNavNodeIconDirective,
    SideNavNodeIndicatorDirective,
    SideNavNodeTextDirective,
    SideNavNodesComponent,
  ],
  exports: [
    SideNavRootDirective,
    SideNavBranchDirective,
    SideNavBranchContentDirective,
    SideNavBranchIndentGuideDirective,
    SideNavBranchNodeDirective,
    SideNavBranchTriggerDirective,
    SideNavBranchTemplateDirective,
    SideNavCollapseTriggerDirective,
    SideNavDividerDirective,
    SideNavFilterInputDirective,
    SideNavGroupDirective,
    SideNavGroupLabelDirective,
    SideNavHeaderDirective,
    SideNavHeaderActionDirective,
    SideNavHeaderLogoDirective,
    SideNavHeaderTitleDirective,
    SideNavLeafNodeDirective,
    SideNavLeafTemplateDirective,
    SideNavNodeAccessoryDirective,
    SideNavNodeActionDirective,
    SideNavNodeContextDirective,
    SideNavNodeIconDirective,
    SideNavNodeIndicatorDirective,
    SideNavNodeTextDirective,
    SideNavNodesComponent,
  ],
  imports: [QBindDirective, NgTemplateOutlet, IconDirective],
})
export class SideNavModule {}
