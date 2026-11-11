// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input} from "@angular/core"

import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import {provideTreeContext} from "@qualcomm-ui/angular-core/tree"
import type {TreeCollection, TreeNode} from "@qualcomm-ui/utils/collection"

import {provideQdsTreeContext} from "./qds-tree-context.service"
import {QdsTreeRootBaseDirective} from "./qds-tree-root-base.directive"

@Directive({
  exportAs: "treeRoot",
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideQdsTreeContext(),
  ],
  selector: "[q-tree-root]",
  standalone: false,
})
export class TreeRootDirective extends QdsTreeRootBaseDirective {
  /**
   * The tree collection data
   * @inheritDoc
   */
  override readonly collection = input<TreeCollection<TreeNode>>()
}
