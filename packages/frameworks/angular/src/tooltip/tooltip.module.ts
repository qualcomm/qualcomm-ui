// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {CdkPortal} from "@angular/cdk/portal"
import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

import {TooltipArrowTipDirective} from "./tooltip-arrow-tip.directive"
import {TooltipArrowDirective} from "./tooltip-arrow.directive"
import {TooltipContentDirective} from "./tooltip-content.directive"
import {TooltipContextDirective} from "./tooltip-context.directive"
import {TooltipFloatingPortalComponent} from "./tooltip-floating-portal.component"
import {TooltipPositionerDirective} from "./tooltip-positioner.directive"
import {TooltipRootDirective} from "./tooltip-root.directive"
import {TooltipTriggerDirective} from "./tooltip-trigger.directive"
import {TooltipDirective} from "./tooltip.directive"

@NgModule({
  declarations: [
    TooltipDirective,
    TooltipRootDirective,
    TooltipArrowDirective,
    TooltipArrowTipDirective,
    TooltipContentDirective,
    TooltipContextDirective,
    TooltipPositionerDirective,
    TooltipTriggerDirective,
    TooltipFloatingPortalComponent,
  ],
  exports: [
    TooltipDirective,
    TooltipRootDirective,
    TooltipArrowDirective,
    TooltipArrowTipDirective,
    TooltipContentDirective,
    TooltipContextDirective,
    TooltipPositionerDirective,
    TooltipTriggerDirective,
    TooltipFloatingPortalComponent,
  ],
  imports: [PortalComponent, CdkPortal, NgTemplateOutlet],
})
export class TooltipModule {}
