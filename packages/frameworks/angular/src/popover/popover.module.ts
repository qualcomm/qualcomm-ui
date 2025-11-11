// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

import {PopoverAnchorDirective} from "./popover-anchor.directive"
import {PopoverArrowTipDirective} from "./popover-arrow-tip.directive"
import {PopoverArrowDirective} from "./popover-arrow.directive"
import {PopoverCloseTriggerDirective} from "./popover-close-trigger.directive"
import {PopoverContentDirective} from "./popover-content.directive"
import {PopoverContextDirective} from "./popover-context.directive"
import {PopoverDescriptionDirective} from "./popover-description.directive"
import {PopoverLabelDirective} from "./popover-label.directive"
import {PopoverPositionerDirective} from "./popover-positioner.directive"
import {PopoverRootDirective} from "./popover-root.directive"
import {PopoverTriggerDirective} from "./popover-trigger.directive"
import {PopoverDirective} from "./popover.directive"

@NgModule({
  declarations: [
    PopoverRootDirective,
    PopoverAnchorDirective,
    PopoverArrowDirective,
    PopoverArrowTipDirective,
    PopoverCloseTriggerDirective,
    PopoverContentDirective,
    PopoverContextDirective,
    PopoverDescriptionDirective,
    PopoverLabelDirective,
    PopoverPositionerDirective,
    PopoverTriggerDirective,
    PopoverDirective,
  ],
  exports: [
    PopoverRootDirective,
    PopoverAnchorDirective,
    PopoverArrowDirective,
    PopoverArrowTipDirective,
    PopoverCloseTriggerDirective,
    PopoverContentDirective,
    PopoverContextDirective,
    PopoverDescriptionDirective,
    PopoverLabelDirective,
    PopoverPositionerDirective,
    PopoverTriggerDirective,
    PopoverDirective,
  ],
  imports: [PortalDirective],
})
export class PopoverModule {}
