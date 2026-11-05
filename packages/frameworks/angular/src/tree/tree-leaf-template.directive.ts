// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, input, TemplateRef} from "@angular/core"

import type {TreeNode} from "@qualcomm-ui/utils/collection"

import type {TreeNodeTemplateContext} from "./qds-tree-context.service"

/**
 * Structural directive that defines the template used to render leaf nodes in a
 * tree. Apply this to an `ng-template` to customize how leaf nodes (nodes without
 * children) are displayed.
 *
 * @example
 * ```html
 * <ng-template q-tree-leaf-template let-node>
 *   <div q-tree-leaf-node>
 *     <span q-tree-node-text>{{ node.item.label }}</span>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: "ng-template[q-tree-leaf-template]",
  standalone: false,
})
export class TreeLeafTemplateDirective<T extends TreeNode> {
  /**
   * The root node of the tree. Used for type narrowing of the template guard.
   * {@link https://angular.dev/guide/directives/structural-directives#type-narrowing-with-template-guards Learn more}
   */
  readonly rootNode = input<T>()

  template = inject(TemplateRef)

  static ngTemplateContextGuard<T extends TreeNode>(
    _dir: TreeLeafTemplateDirective<T>,
    _ctx: unknown,
  ): _ctx is TreeNodeTemplateContext<T> {
    return true
  }
}
