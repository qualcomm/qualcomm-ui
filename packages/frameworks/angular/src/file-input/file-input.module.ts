// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {
  InputEndIconComponent,
  InputStartIconComponent,
} from "@qualcomm-ui/angular/input"

import {FileInputClearTriggerDirective} from "./file-input-clear-trigger.directive"
import {FileInputControlDirective} from "./file-input-control.directive"
import {FileInputDisplayDirective} from "./file-input-display.directive"
import {FileInputErrorTextDirective} from "./file-input-error-text.directive"
import {FileInputHiddenInputDirective} from "./file-input-hidden-input.directive"
import {FileInputLabelDirective} from "./file-input-label.directive"
import {FileInputRootDirective} from "./file-input-root.directive"
import {FileInputComponent} from "./file-input.component"

/**
 * @since 2.8.0
 */
@NgModule({
  declarations: [
    FileInputComponent,
    FileInputRootDirective,
    FileInputLabelDirective,
    FileInputControlDirective,
    FileInputDisplayDirective,
    FileInputClearTriggerDirective,
    FileInputHiddenInputDirective,
    FileInputErrorTextDirective,
  ],
  exports: [
    FileInputComponent,
    FileInputRootDirective,
    FileInputLabelDirective,
    FileInputControlDirective,
    FileInputDisplayDirective,
    FileInputClearTriggerDirective,
    FileInputHiddenInputDirective,
    FileInputErrorTextDirective,
  ],
  imports: [
    QBindDirective,
    IconDirective,
    InputStartIconComponent,
    InputEndIconComponent,
  ],
})
export class FileInputModule {}
