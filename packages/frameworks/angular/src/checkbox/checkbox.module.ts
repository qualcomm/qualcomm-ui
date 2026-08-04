// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {CheckmarkIconComponent} from "@qualcomm-ui/angular/checkmark"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {CheckboxControlComponent} from "./checkbox-control.component"
import {CheckboxErrorTextComponent} from "./checkbox-error-text.component"
import {CheckboxHiddenInputDirective} from "./checkbox-hidden-input.directive"
import {CheckboxHintDirective} from "./checkbox-hint.directive"
import {CheckboxIndicatorComponent} from "./checkbox-indicator.component"
import {CheckboxLabelDirective} from "./checkbox-label.directive"
import {CheckboxRootDirective} from "./checkbox-root.directive"
import {CheckboxComponent} from "./checkbox.component"

@NgModule({
  declarations: [
    CheckboxComponent,
    CheckboxRootDirective,
    CheckboxControlComponent,
    CheckboxLabelDirective,
    CheckboxHiddenInputDirective,
    CheckboxHintDirective,
    CheckboxIndicatorComponent,
    CheckboxErrorTextComponent,
  ],
  exports: [
    CheckboxComponent,
    CheckboxRootDirective,
    CheckboxControlComponent,
    CheckboxLabelDirective,
    CheckboxHiddenInputDirective,
    CheckboxHintDirective,
    CheckboxIndicatorComponent,
    CheckboxErrorTextComponent,
  ],
  imports: [QBindDirective, IconDirective, CheckmarkIconComponent],
})
export class CheckboxModule {}
