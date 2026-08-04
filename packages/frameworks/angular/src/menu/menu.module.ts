// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CheckmarkIconComponent} from "@qualcomm-ui/angular/checkmark"
import {IconDirective, StartIconDirective} from "@qualcomm-ui/angular/icon"

import {MenuButtonComponent} from "./menu-button.component"
import {MenuCheckboxItemControlComponent} from "./menu-checkbox-item-control.component"
import {MenuCheckboxItemDirective} from "./menu-checkbox-item.directive"
import {MenuContentDirective} from "./menu-content.directive"
import {MenuContextTriggerDirective} from "./menu-context-trigger.directive"
import {MenuIconButtonComponent} from "./menu-icon-button.component"
import {MenuItemCommandDirective} from "./menu-item-command.directive"
import {MenuItemDescriptionDirective} from "./menu-item-description.directive"
import {MenuItemGroupLabelDirective} from "./menu-item-group-label.directive"
import {MenuItemGroupDirective} from "./menu-item-group.directive"
import {MenuItemIndicatorComponent} from "./menu-item-indicator.component"
import {MenuItemLabelDirective} from "./menu-item-label.directive"
import {MenuItemStartIconComponent} from "./menu-item-start-icon.component"
import {MenuItemDirective} from "./menu-item.directive"
import {MenuPositionerComponent} from "./menu-positioner.component"
import {MenuRadioItemControlDirective} from "./menu-radio-item-control.directive"
import {MenuRadioItemGroupDirective} from "./menu-radio-item-group.directive"
import {MenuRadioItemDirective} from "./menu-radio-item.directive"
import {MenuSeparatorDirective} from "./menu-separator.directive"
import {MenuSplitButtonComponent} from "./menu-split-button.component"
import {MenuTriggerItemIndicatorComponent} from "./menu-trigger-item-indicator.component"
import {MenuTriggerItemComponent} from "./menu-trigger-item.component"
import {MenuTriggerDirective} from "./menu-trigger.directive"
import {MenuComponent} from "./menu.component"

@NgModule({
  declarations: [
    MenuComponent,
    MenuContentDirective,
    MenuPositionerComponent,
    MenuSeparatorDirective,
    MenuTriggerDirective,
    MenuContextTriggerDirective,
    MenuItemDirective,
    MenuTriggerItemComponent,
    MenuItemStartIconComponent,
    MenuTriggerItemIndicatorComponent,
    MenuRadioItemDirective,
    MenuRadioItemControlDirective,
    MenuItemCommandDirective,
    MenuItemDescriptionDirective,
    MenuItemGroupDirective,
    MenuItemGroupLabelDirective,
    MenuItemIndicatorComponent,
    MenuButtonComponent,
    MenuIconButtonComponent,
    MenuCheckboxItemDirective,
    MenuCheckboxItemControlComponent,
    MenuRadioItemGroupDirective,
    MenuItemLabelDirective,
    MenuSplitButtonComponent,
  ],
  exports: [
    MenuComponent,
    MenuContentDirective,
    MenuPositionerComponent,
    MenuSeparatorDirective,
    MenuTriggerDirective,
    MenuContextTriggerDirective,
    MenuItemStartIconComponent,
    MenuItemDirective,
    MenuTriggerItemComponent,
    MenuTriggerItemIndicatorComponent,
    MenuRadioItemDirective,
    MenuRadioItemControlDirective,
    MenuItemCommandDirective,
    MenuItemDescriptionDirective,
    MenuItemGroupDirective,
    MenuItemGroupLabelDirective,
    MenuItemIndicatorComponent,
    MenuButtonComponent,
    MenuIconButtonComponent,
    MenuCheckboxItemDirective,
    MenuCheckboxItemControlComponent,
    MenuRadioItemGroupDirective,
    MenuItemLabelDirective,
    MenuSplitButtonComponent,
  ],
  imports: [
    QBindDirective,
    IconDirective,
    ButtonModule,
    StartIconDirective,
    CheckmarkIconComponent,
  ],
})
export class MenuModule {}
