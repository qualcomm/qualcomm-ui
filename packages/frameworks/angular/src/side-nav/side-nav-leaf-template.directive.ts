// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, input, TemplateRef} from "@angular/core"

import type {TreeNode} from "@qualcomm-ui/utils/collection"

import type {SideNavNodeTemplateContext} from "./qds-side-nav-context.service"

/**
 * Structural directive that defines the template used to render leaf nodes in a
 * side nav. Apply this to an `ng-template` to customize how leaf nodes (nodes
 * without children) are displayed.
 *
 * @example
 * ```html
 * <ng-template q-side-nav-leaf-template let-node>
 *   <div q-side-nav-leaf-node>
 *     <span q-side-nav-node-text>{{ node.item.label }}</span>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: "ng-template[q-side-nav-leaf-template]",
  standalone: false,
})
export class SideNavLeafTemplateDirective<T extends TreeNode> {
  /**
   * The root node of the tree. Used for type narrowing of the template guard.
   */
  readonly rootNode = input<T>()

  template = inject(TemplateRef)

  static ngTemplateContextGuard<T extends TreeNode>(
    dir: SideNavLeafTemplateDirective<T>,
    _ctx: unknown,
  ): _ctx is SideNavNodeTemplateContext<T> {
    return true
  }
}
