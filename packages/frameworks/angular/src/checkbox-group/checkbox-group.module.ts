// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {FieldGroupModule} from "@qualcomm-ui/angular/field-group"

import {CheckboxGroupComponent} from "./checkbox-group.component"

@NgModule({
  declarations: [CheckboxGroupComponent],
  exports: [CheckboxGroupComponent],
  imports: [FieldGroupModule],
})
export class CheckboxGroupModule {}
