import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TagDirective} from "@qualcomm-ui/angular/tag"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

import {SelectClearTriggerDirective} from "./select-clear-trigger.directive"
import {SelectContentDirective} from "./select-content.directive"
import {SelectContextDirective} from "./select-context.directive"
import {SelectControlDirective} from "./select-control.directive"
import {SelectErrorIndicatorDirective} from "./select-error-indicator.directive"
import {SelectErrorTextDirective} from "./select-error-text.directive"
import {SelectHiddenSelectDirective} from "./select-hidden-select.directive"
import {SelectHintDirective} from "./select-hint.directive"
import {SelectIndicatorDirective} from "./select-indicator.directive"
import {SelectItemIndicatorDirective} from "./select-item-indicator.directive"
import {SelectItemTextDirective} from "./select-item-text.directive"
import {SelectItemDirective} from "./select-item.directive"
import {SelectItemsComponent} from "./select-items.component"
import {SelectLabelDirective} from "./select-label.directive"
import {SelectPositionerDirective} from "./select-positioner.directive"
import {SelectRootDirective} from "./select-root.directive"
import {SelectValueTextDirective} from "./select-value-text.directive"
import {SelectComponent} from "./select.component"

@NgModule({
  declarations: [
    SelectComponent,
    SelectRootDirective,
    SelectClearTriggerDirective,
    SelectContentDirective,
    SelectContextDirective,
    SelectHiddenSelectDirective,
    SelectItemDirective,
    SelectItemTextDirective,
    SelectItemIndicatorDirective,
    SelectLabelDirective,
    SelectPositionerDirective,
    SelectControlDirective,
    SelectValueTextDirective,
    SelectErrorTextDirective,
    SelectErrorIndicatorDirective,
    SelectHintDirective,
    SelectIndicatorDirective,
    SelectItemsComponent,
  ],
  exports: [
    SelectComponent,
    SelectRootDirective,
    SelectClearTriggerDirective,
    SelectContentDirective,
    SelectContextDirective,
    SelectHiddenSelectDirective,
    SelectItemDirective,
    SelectItemTextDirective,
    SelectItemIndicatorDirective,
    SelectLabelDirective,
    SelectPositionerDirective,
    SelectControlDirective,
    SelectValueTextDirective,
    SelectErrorTextDirective,
    SelectErrorIndicatorDirective,
    SelectHintDirective,
    SelectIndicatorDirective,
    SelectItemsComponent,
  ],
  imports: [IconDirective, QBindDirective, TagDirective, PortalDirective],
})
export class SelectModule {}
