// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

import {DialogBackdropDirective} from "./dialog-backdrop.directive"
import {DialogBodyComponent} from "./dialog-body.component"
import {DialogCloseButtonComponent} from "./dialog-close-button.component"
import {DialogCloseTriggerDirective} from "./dialog-close-trigger.directive"
import {DialogContentDirective} from "./dialog-content.directive"
import {DialogContextDirective} from "./dialog-context.directive"
import {DialogDescriptionDirective} from "./dialog-description.directive"
import {DialogFloatingPortalComponent} from "./dialog-floating-portal.component"
import {DialogFooterDirective} from "./dialog-footer.directive"
import {DialogHeadingDirective} from "./dialog-heading.directive"
import {DialogIndicatorIconDirective} from "./dialog-indicator-icon.directive"
import {DialogPositionerComponent} from "./dialog-positioner.component"
import {DialogRootDirective} from "./dialog-root.directive"
import {DialogTriggerDirective} from "./dialog-trigger.directive"

@NgModule({
  declarations: [
    DialogRootDirective,
    DialogBackdropDirective,
    DialogCloseTriggerDirective,
    DialogContentDirective,
    DialogDescriptionDirective,
    DialogHeadingDirective,
    DialogPositionerComponent,
    DialogTriggerDirective,
    DialogFooterDirective,
    DialogCloseButtonComponent,
    DialogFloatingPortalComponent,
    DialogBodyComponent,
    DialogContextDirective,
    DialogIndicatorIconDirective,
  ],
  exports: [
    DialogRootDirective,
    DialogBackdropDirective,
    DialogCloseTriggerDirective,
    DialogContentDirective,
    DialogDescriptionDirective,
    DialogHeadingDirective,
    DialogPositionerComponent,
    DialogTriggerDirective,
    DialogFooterDirective,
    DialogCloseButtonComponent,
    DialogFloatingPortalComponent,
    DialogBodyComponent,
    DialogContextDirective,
    DialogIndicatorIconDirective,
  ],
  imports: [QBindDirective, IconDirective, NgTemplateOutlet, PortalDirective],
})
export class DialogModule {}
