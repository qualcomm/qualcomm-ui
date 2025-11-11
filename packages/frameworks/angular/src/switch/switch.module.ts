// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {SwitchControlComponent} from "./switch-control.component"
import {SwitchErrorTextComponent} from "./switch-error-text.component"
import {SwitchHiddenInputDirective} from "./switch-hidden-input.directive"
import {SwitchLabelDirective} from "./switch-label.directive"
import {SwitchRootDirective} from "./switch-root.directive"
import {SwitchThumbDirective} from "./switch-thumb.directive"
import {SwitchComponent} from "./switch.component"

@NgModule({
  declarations: [
    SwitchComponent,
    SwitchRootDirective,
    SwitchControlComponent,
    SwitchLabelDirective,
    SwitchHiddenInputDirective,
    SwitchThumbDirective,
    SwitchErrorTextComponent,
  ],
  exports: [
    SwitchComponent,
    SwitchRootDirective,
    SwitchControlComponent,
    SwitchLabelDirective,
    SwitchHiddenInputDirective,
    SwitchThumbDirective,
    SwitchErrorTextComponent,
  ],
  imports: [QBindDirective, IconDirective],
})
export class SwitchModule {}
