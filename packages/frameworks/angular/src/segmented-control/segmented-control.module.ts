// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"

import {SegmentedControlHiddenInputDirective} from "./segmented-control-hidden-input.directive"
import {SegmentedControlItemRootDirective} from "./segmented-control-item-root.directive"
import {SegmentedControlItemTextDirective} from "./segmented-control-item-text.directive"
import {SegmentedControlItemComponent} from "./segmented-control-item.component"
import {SegmentedControlDirective} from "./segmented-control.directive"

@NgModule({
  declarations: [
    SegmentedControlDirective,
    SegmentedControlItemComponent,
    SegmentedControlItemRootDirective,
    SegmentedControlItemTextDirective,
    SegmentedControlHiddenInputDirective,
  ],
  exports: [
    SegmentedControlDirective,
    SegmentedControlItemComponent,
    SegmentedControlItemRootDirective,
    SegmentedControlItemTextDirective,
    SegmentedControlHiddenInputDirective,
  ],
  imports: [IconDirective],
})
export class SegmentedControlModule {}
