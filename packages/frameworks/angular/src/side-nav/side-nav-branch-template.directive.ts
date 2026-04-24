// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, input, TemplateRef} from "@angular/core"

import type {TreeNode} from "@qualcomm-ui/utils/collection"

import type {SideNavNodeTemplateContext} from "./qds-side-nav-context.service"

/**
 * Structural directive that defines the template used to render branch nodes in a
 * side nav. Apply this to an `ng-template` to customize how branch nodes (nodes with
 * children) are displayed. Note that this template will only customize the content
 * of the node. The parent `<q-side-nav-nodes>` component renders the branch children
 * internally.
 *
 * @example
 * ```html
 * <ng-template q-side-nav-branch-template let-node>
 *   <div q-side-nav-branch-node>
 *     <span q-side-nav-node-text>{{ node.item.label }}</span>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: "ng-template[q-side-nav-branch-template]",
  standalone: false,
})
export class SideNavBranchTemplateDirective<T extends TreeNode> {
  /**
   * The root node of the tree. Used for type narrowing of the template guard.
   */
  readonly rootNode = input<T>()

  template = inject(TemplateRef)

  static ngTemplateContextGuard<T extends TreeNode>(
    dir: SideNavBranchTemplateDirective<T>,
    _ctx: unknown,
  ): _ctx is SideNavNodeTemplateContext<T> {
    return true
  }
}
