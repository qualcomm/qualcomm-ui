import {NgModule} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {MenuButtonComponent} from "./menu-button.component"
import {MenuCheckboxItemDirective} from "./menu-checkbox-item.directive"
import {MenuContentDirective} from "./menu-content.directive"
import {MenuContextTriggerDirective} from "./menu-context-trigger.directive"
import {MenuItemCommandDirective} from "./menu-item-command.directive"
import {MenuItemGroupLabelDirective} from "./menu-item-group-label.directive"
import {MenuItemGroupDirective} from "./menu-item-group.directive"
import {MenuItemIndicatorComponent} from "./menu-item-indicator.component"
import {MenuItemStartIconComponent} from "./menu-item-start-icon.component"
import {MenuItemDirective} from "./menu-item.directive"
import {MenuPositionerComponent} from "./menu-positioner.component"
import {MenuRadioItemGroupDirective} from "./menu-radio-item-group.directive"
import {MenuRadioItemDirective} from "./menu-radio-item.directive"
import {MenuSeparatorDirective} from "./menu-separator.directive"
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
    MenuItemCommandDirective,
    MenuItemGroupDirective,
    MenuItemGroupLabelDirective,
    MenuItemIndicatorComponent,
    MenuButtonComponent,
    MenuCheckboxItemDirective,
    MenuRadioItemGroupDirective,
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
    MenuItemCommandDirective,
    MenuItemGroupDirective,
    MenuItemGroupLabelDirective,
    MenuItemIndicatorComponent,
    MenuButtonComponent,
    MenuCheckboxItemDirective,
    MenuRadioItemGroupDirective,
  ],
  imports: [
    QBindDirective,
    IconDirective,
    ButtonModule,
    StartIconDirective,
    EndIconDirective,
  ],
})
export class MenuModule {}
