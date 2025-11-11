// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {RadioControlDirective} from "./radio-control.directive"
import {
  RadioGroupDirective,
  RadioGroupErrorTextComponent,
  RadioGroupItemsDirective,
  RadioGroupLabelDirective,
} from "./radio-group"
import {RadioHiddenInputDirective} from "./radio-hidden-input.directive"
import {RadioLabelDirective} from "./radio-label.directive"
import {RadioRootDirective} from "./radio-root.directive"
import {RadioComponent} from "./radio.component"

@NgModule({
  declarations: [
    RadioComponent,
    RadioGroupErrorTextComponent,
    RadioGroupDirective,
    RadioGroupLabelDirective,
    RadioGroupItemsDirective,
    RadioHiddenInputDirective,
    RadioLabelDirective,
    RadioControlDirective,
    RadioRootDirective,
  ],
  exports: [
    RadioComponent,
    RadioGroupErrorTextComponent,
    RadioGroupDirective,
    RadioGroupLabelDirective,
    RadioGroupItemsDirective,
    RadioHiddenInputDirective,
    RadioLabelDirective,
    RadioControlDirective,
    RadioRootDirective,
  ],
  imports: [QBindDirective, IconDirective],
})
export class RadioModule {}
