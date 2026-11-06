// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {TreeModule} from "@qualcomm-ui/angular/tree"

import {JsonViewerKeyNodeComponent} from "./json-viewer-key-node.component"
import {JsonViewerNodeComponent} from "./json-viewer-node.component"
import {JsonViewerRootDirective} from "./json-viewer-root.directive"
import {JsonViewerTreeDirective} from "./json-viewer-tree.directive"
import {JsonViewerValueNodeComponent} from "./json-viewer-value-node.component"
import {JsonViewerComponent} from "./json-viewer.component"

@NgModule({
  declarations: [
    JsonViewerComponent,
    JsonViewerKeyNodeComponent,
    JsonViewerNodeComponent,
    JsonViewerRootDirective,
    JsonViewerTreeDirective,
    JsonViewerValueNodeComponent,
  ],
  exports: [
    JsonViewerComponent,
    JsonViewerRootDirective,
    JsonViewerTreeDirective,
  ],
  imports: [QBindDirective, TreeModule],
})
export class JsonViewerModule {}
