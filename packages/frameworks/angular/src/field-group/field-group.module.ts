// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {FieldGroupErrorTextComponent} from "./field-group-error-text.component"
import {FieldGroupHintDirective} from "./field-group-hint.directive"
import {FieldGroupItemsDirective} from "./field-group-items.directive"
import {FieldGroupLabelDirective} from "./field-group-label.directive"
import {FieldGroupRootDirective} from "./field-group-root.directive"

@NgModule({
  declarations: [
    FieldGroupErrorTextComponent,
    FieldGroupHintDirective,
    FieldGroupItemsDirective,
    FieldGroupLabelDirective,
    FieldGroupRootDirective,
  ],
  exports: [
    FieldGroupErrorTextComponent,
    FieldGroupHintDirective,
    FieldGroupItemsDirective,
    FieldGroupLabelDirective,
    FieldGroupRootDirective,
  ],
  imports: [QBindDirective, IconDirective],
})
export class FieldGroupModule {}
