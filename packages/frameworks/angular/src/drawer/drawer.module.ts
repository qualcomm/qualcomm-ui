import {CdkPortal} from "@angular/cdk/portal"
import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {DrawerBackdropDirective} from "./drawer-backdrop.directive"
import {DrawerBodyComponent} from "./drawer-body.component"
import {DrawerCloseButtonComponent} from "./drawer-close-button.component"
import {DrawerCloseTriggerDirective} from "./drawer-close-trigger.directive"
import {DrawerContentDirective} from "./drawer-content.directive"
import {DrawerContextDirective} from "./drawer-context.directive"
import {DrawerDescriptionDirective} from "./drawer-description.directive"
import {DrawerFloatingPortalComponent} from "./drawer-floating-portal.component"
import {DrawerFooterDirective} from "./drawer-footer.directive"
import {DrawerHeadingDirective} from "./drawer-heading.directive"
import {DrawerIndicatorIconDirective} from "./drawer-indicator-icon.directive"
import {DrawerPositionerComponent} from "./drawer-positioner.component"
import {DrawerRootDirective} from "./drawer-root.component"
import {DrawerTriggerDirective} from "./drawer-trigger.directive"

@NgModule({
  declarations: [
    DrawerRootDirective,
    DrawerBackdropDirective,
    DrawerCloseTriggerDirective,
    DrawerContentDirective,
    DrawerDescriptionDirective,
    DrawerHeadingDirective,
    DrawerPositionerComponent,
    DrawerTriggerDirective,
    DrawerFooterDirective,
    DrawerCloseButtonComponent,
    DrawerFloatingPortalComponent,
    DrawerBodyComponent,
    DrawerContextDirective,
    DrawerIndicatorIconDirective,
  ],
  exports: [
    DrawerRootDirective,
    DrawerBackdropDirective,
    DrawerCloseTriggerDirective,
    DrawerContentDirective,
    DrawerDescriptionDirective,
    DrawerHeadingDirective,
    DrawerPositionerComponent,
    DrawerTriggerDirective,
    DrawerFooterDirective,
    DrawerCloseButtonComponent,
    DrawerFloatingPortalComponent,
    DrawerBodyComponent,
    DrawerContextDirective,
    DrawerIndicatorIconDirective,
  ],
  imports: [QBindDirective, IconDirective, NgTemplateOutlet, CdkPortal],
})
export class DrawerModule {}
