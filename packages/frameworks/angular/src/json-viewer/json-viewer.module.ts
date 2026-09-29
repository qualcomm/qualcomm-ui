// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {TreeModule} from "@qualcomm-ui/angular/tree"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {JsonViewerKeyNodeComponent} from "./json-viewer-key-node.component"
import {JsonViewerNodeComponent} from "./json-viewer-node.component"
import {JsonViewerRootProviderComponent} from "./json-viewer-root-provider.component"
import {JsonViewerRootComponent} from "./json-viewer-root.component"
import {JsonViewerTreeRootDirective} from "./json-viewer-tree-root.directive"
import {JsonViewerTreeComponent} from "./json-viewer-tree.component"
import {JsonViewerValueNodeComponent} from "./json-viewer-value-node.component"
import {JsonViewerComponent} from "./json-viewer.component"

@NgModule({
  declarations: [
    JsonViewerComponent,
    JsonViewerKeyNodeComponent,
    JsonViewerNodeComponent,
    JsonViewerRootComponent,
    JsonViewerRootProviderComponent,
    JsonViewerTreeComponent,
    JsonViewerTreeRootDirective,
    JsonViewerValueNodeComponent,
  ],
  exports: [
    JsonViewerComponent,
    JsonViewerRootComponent,
    JsonViewerRootProviderComponent,
    JsonViewerTreeComponent,
  ],
  imports: [QBindDirective, TreeModule],
})
export class JsonViewerModule {}
