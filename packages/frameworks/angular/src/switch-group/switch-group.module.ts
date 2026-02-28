// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {FieldGroupModule} from "@qualcomm-ui/angular/field-group"

import {SwitchGroupComponent} from "./switch-group.component"

@NgModule({
  declarations: [SwitchGroupComponent],
  exports: [SwitchGroupComponent],
  imports: [FieldGroupModule],
})
export class SwitchGroupModule {}
