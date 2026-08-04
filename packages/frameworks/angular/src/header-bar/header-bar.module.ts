// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"

import {HeaderBarActionBarDirective} from "./header-bar-action-bar.directive"
import {HeaderBarActionButtonDirective} from "./header-bar-action-button.directive"
import {HeaderBarActionIconButtonDirective} from "./header-bar-action-icon-button.directive"
import {HeaderBarAppTitleDirective} from "./header-bar-app-title.directive"
import {HeaderBarDividerDirective} from "./header-bar-divider.directive"
import {HeaderBarLogoDirective} from "./header-bar-logo.directive"
import {HeaderBarMenuItemDirective} from "./header-bar-menu-item.directive"
import {HeaderBarNavItemDirective} from "./header-bar-nav-item.directive"
import {HeaderBarNavDirective} from "./header-bar-nav.directive"
import {HeaderBarRootDirective} from "./header-bar-root.directive"
import {HeaderBarWindowControlsDirective} from "./header-bar-window-controls.directive"

@NgModule({
  declarations: [
    HeaderBarActionButtonDirective,
    HeaderBarActionIconButtonDirective,
    HeaderBarActionBarDirective,
    HeaderBarAppTitleDirective,
    HeaderBarDividerDirective,
    HeaderBarLogoDirective,
    HeaderBarMenuItemDirective,
    HeaderBarNavDirective,
    HeaderBarNavItemDirective,
    HeaderBarRootDirective,
    HeaderBarWindowControlsDirective,
  ],
  exports: [
    HeaderBarActionButtonDirective,
    HeaderBarActionIconButtonDirective,
    HeaderBarActionBarDirective,
    HeaderBarAppTitleDirective,
    HeaderBarDividerDirective,
    HeaderBarLogoDirective,
    HeaderBarMenuItemDirective,
    HeaderBarNavDirective,
    HeaderBarNavItemDirective,
    HeaderBarRootDirective,
    HeaderBarWindowControlsDirective,
  ],
  imports: [
    EndIconDirective,
    IconDirective,
    QBindDirective,
    StartIconDirective,
  ],
})
export class HeaderBarModule {}
