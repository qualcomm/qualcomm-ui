// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input} from "@angular/core"

import type {TreeCollection, TreeNode} from "@qualcomm-ui/utils/collection"

import {CoreTreeRootBaseDirective} from "./core-tree-root-base.directive"

@Directive()
export class CoreTreeRootDirective<
  T extends TreeNode = TreeNode,
> extends CoreTreeRootBaseDirective<T> {
  /**
   * The tree collection data
   * @inheritDoc
   */
  override readonly collection = input<TreeCollection<T>>()
}
