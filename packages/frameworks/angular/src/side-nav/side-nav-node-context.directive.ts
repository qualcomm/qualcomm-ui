// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, input} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {TreeNodeStateContextService} from "@qualcomm-ui/angular-core/tree"
import type {NodeState} from "@qualcomm-ui/core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

@Directive({
  selector: "[sideNavNodeContext]",
  standalone: false,
})
export class SideNavNodeContextDirective<
  T extends TreeNode,
> extends ApiContextDirective<NodeState<T>> {
  /**
   * The root node of the tree. Used for type narrowing of the template guard.
   */
  readonly rootNode = input<T>()

  constructor() {
    const contextService = inject(TreeNodeStateContextService)
    super(contextService, "sideNavNodeContext")
  }

  static ngTemplateContextGuard<T extends TreeNode>(
    dir: SideNavNodeContextDirective<T>,
    _ctx: unknown,
  ): _ctx is {$implicit: NodeState<T>} {
    return true
  }
}
