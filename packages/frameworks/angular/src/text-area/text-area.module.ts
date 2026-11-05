// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {TextAreaCounterDirective} from "./text-area-counter.directive"
import {TextAreaErrorTextDirective} from "./text-area-error-text.directive"
import {TextAreaHintDirective} from "./text-area-hint.directive"
import {TextAreaInputDirective} from "./text-area-input.directive"
import {TextAreaLabelDirective} from "./text-area-label.directive"
import {TextAreaRootDirective} from "./text-area-root.directive"
import {TextAreaComponent} from "./text-area.component"

@NgModule({
  declarations: [
    TextAreaLabelDirective,
    TextAreaRootDirective,
    TextAreaInputDirective,
    TextAreaCounterDirective,
    TextAreaHintDirective,
    TextAreaErrorTextDirective,
    TextAreaComponent,
  ],
  exports: [
    TextAreaLabelDirective,
    TextAreaRootDirective,
    TextAreaInputDirective,
    TextAreaCounterDirective,
    TextAreaHintDirective,
    TextAreaErrorTextDirective,
    TextAreaComponent,
  ],
  imports: [QBindDirective, IconDirective],
})
export class TextAreaModule {}
