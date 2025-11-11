// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {InputStartIconComponent} from "@qualcomm-ui/angular/input"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {PasswordInputClearTriggerDirective} from "./password-input-clear-trigger.directive"
import {PasswordInputErrorIndicatorDirective} from "./password-input-error-indicator.directive"
import {PasswordInputErrorTextDirective} from "./password-input-error-text.directive"
import {PasswordInputHintDirective} from "./password-input-hint.directive"
import {PasswordInputInputGroupDirective} from "./password-input-input-group.directive"
import {PasswordInputInputDirective} from "./password-input-input.directive"
import {PasswordInputLabelDirective} from "./password-input-label.directive"
import {PasswordInputRootDirective} from "./password-input-root.directive"
import {PasswordInputVisibilityTriggerDirective} from "./password-input-visibility-trigger.directive"
import {PasswordInputComponent} from "./password-input.component"

@NgModule({
  declarations: [
    PasswordInputComponent,
    PasswordInputRootDirective,
    PasswordInputClearTriggerDirective,
    PasswordInputErrorIndicatorDirective,
    PasswordInputErrorTextDirective,
    PasswordInputHintDirective,
    PasswordInputInputDirective,
    PasswordInputInputGroupDirective,
    PasswordInputLabelDirective,
    PasswordInputVisibilityTriggerDirective,
  ],
  exports: [
    PasswordInputComponent,
    PasswordInputRootDirective,
    PasswordInputClearTriggerDirective,
    PasswordInputErrorIndicatorDirective,
    PasswordInputErrorTextDirective,
    PasswordInputHintDirective,
    PasswordInputInputDirective,
    PasswordInputInputGroupDirective,
    PasswordInputLabelDirective,
    PasswordInputVisibilityTriggerDirective,
  ],
  imports: [IconDirective, QBindDirective, InputStartIconComponent],
})
export class PasswordInputModule {}
