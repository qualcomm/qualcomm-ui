// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {StepperCompletedContentDirective} from "./stepper-completed-content.directive"
import {StepperContentDirective} from "./stepper-content.directive"
import {StepperContextDirective} from "./stepper-context.directive"
import {StepperHintDirective} from "./stepper-hint.directive"
import {StepperIndicatorIconDirective} from "./stepper-indicator-icon.directive"
import {StepperIndicatorDirective} from "./stepper-indicator.directive"
import {StepperItemDirective} from "./stepper-item.directive"
import {StepperLabelDirective} from "./stepper-label.directive"
import {StepperListDirective} from "./stepper-list.directive"
import {StepperNextTriggerDirective} from "./stepper-next-trigger.directive"
import {StepperPrevTriggerDirective} from "./stepper-prev-trigger.directive"
import {StepperRootDirective} from "./stepper-root.directive"
import {StepperSeparatorDirective} from "./stepper-separator.directive"
import {StepperTriggerDirective} from "./stepper-trigger.directive"

@NgModule({
  declarations: [
    StepperCompletedContentDirective,
    StepperContentDirective,
    StepperContextDirective,
    StepperHintDirective,
    StepperIndicatorDirective,
    StepperIndicatorIconDirective,
    StepperItemDirective,
    StepperLabelDirective,
    StepperListDirective,
    StepperNextTriggerDirective,
    StepperPrevTriggerDirective,
    StepperRootDirective,
    StepperSeparatorDirective,
    StepperTriggerDirective,
  ],
  exports: [
    StepperCompletedContentDirective,
    StepperContentDirective,
    StepperContextDirective,
    StepperHintDirective,
    StepperIndicatorDirective,
    StepperIndicatorIconDirective,
    StepperItemDirective,
    StepperLabelDirective,
    StepperListDirective,
    StepperNextTriggerDirective,
    StepperPrevTriggerDirective,
    StepperRootDirective,
    StepperSeparatorDirective,
    StepperTriggerDirective,
  ],
  imports: [IconDirective, QBindDirective],
})
export class StepperModule {}
