// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {RadioControlDirective} from "./radio-control.directive"
import {
  RadioGroupDirective,
  RadioGroupErrorTextComponent,
  RadioGroupHintDirective,
  RadioGroupItemsDirective,
  RadioGroupLabelDirective,
} from "./radio-group"
import {RadioHiddenInputDirective} from "./radio-hidden-input.directive"
import {RadioHintDirective} from "./radio-hint.directive"
import {RadioLabelDirective} from "./radio-label.directive"
import {RadioRootDirective} from "./radio-root.directive"
import {RadioComponent} from "./radio.component"

@NgModule({
  declarations: [
    RadioComponent,
    RadioControlDirective,
    RadioGroupDirective,
    RadioGroupErrorTextComponent,
    RadioGroupHintDirective,
    RadioGroupItemsDirective,
    RadioGroupLabelDirective,
    RadioHiddenInputDirective,
    RadioHintDirective,
    RadioLabelDirective,
    RadioRootDirective,
  ],
  exports: [
    RadioComponent,
    RadioControlDirective,
    RadioGroupDirective,
    RadioGroupErrorTextComponent,
    RadioGroupHintDirective,
    RadioGroupItemsDirective,
    RadioGroupLabelDirective,
    RadioHiddenInputDirective,
    RadioHintDirective,
    RadioLabelDirective,
    RadioRootDirective,
  ],
  imports: [QBindDirective, IconDirective],
})
export class RadioModule {}
