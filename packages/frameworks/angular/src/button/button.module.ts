// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {ButtonGroupDirective} from "./button-group.directive"
import {ButtonDirective} from "./button.directive"
import {IconButtonDirective} from "./icon-button.directive"

@NgModule({
  declarations: [IconButtonDirective, ButtonDirective, ButtonGroupDirective],
  exports: [IconButtonDirective, ButtonDirective, ButtonGroupDirective],
  imports: [
    IconDirective,
    QBindDirective,
    StartIconDirective,
    EndIconDirective,
  ],
})
export class ButtonModule {}
