// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  inject,
  Injector,
  input,
  type OnInit,
  type TemplateRef,
} from "@angular/core"

import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  provideTreeNodePropsContext,
  provideTreeNodeStateContext,
  TreeNodePropsContextService,
  TreeNodeStateContextService,
  useTreeContext,
} from "@qualcomm-ui/angular-core/tree"
import type {NodeProps} from "@qualcomm-ui/core/tree"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

import type {TreeNodeTemplateContext} from "./qds-tree-context.service"
import {TreeBranchTemplateDirective} from "./tree-branch-template.directive"
import {TreeLeafTemplateDirective} from "./tree-leaf-template.directive"

@Component({
  providers: [provideTreeNodePropsContext(), provideTreeNodeStateContext()],
  selector: "q-tree-nodes",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    @if (childNodes().length) {
      <div q-tree-branch>
        <ng-template
          [ngTemplateOutlet]="branchTemplate()!"
          [ngTemplateOutletContext]="templateContext()"
          [ngTemplateOutletInjector]="injector"
        />

        <div q-tree-branch-content>
          @if (showIndentGuide()) {
            <div q-tree-branch-indent-guide></div>
          }
          @for (
            child of childNodes();
            let i = $index;
            track treeContext().collection.getNodeValue(child)
          ) {
            <q-tree-nodes
              [indexPath]="getChildIndexPath(i)"
              [node]="child"
              [renderBranch]="branchTemplate()"
              [renderLeaf]="leafTemplate()"
              [showIndentGuide]="showIndentGuide()"
            />
          }
        </div>
      </div>
    } @else {
      <ng-template
        [ngTemplateOutlet]="leafTemplate()!"
        [ngTemplateOutletContext]="templateContext()"
        [ngTemplateOutletInjector]="injector"
      />
    }
  `,
})
export class TreeNodesComponent<T extends TreeNode>
  implements SignalifyInput<NodeProps<T>>, OnInit
{
  /**
   * The index path of the tree node
   */
  readonly indexPath = input.required<number[]>()

  /**
   * The tree node
   *
   * @inheritDoc
   */
  readonly node = input.required<T>()

  readonly renderBranch = input<TemplateRef<TreeBranchTemplateDirective<T>>>()

  readonly renderLeaf = input<TemplateRef<TreeLeafTemplateDirective<T>>>()

  /**
   * Whether to render the indent guide for branch child nodes.
   *
   * @default false
   */
  readonly showIndentGuide = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  readonly treeBranchContentChild = contentChild<
    TreeBranchTemplateDirective<T>
  >(TreeBranchTemplateDirective<T>)

  readonly treeLeafContentChild = contentChild<TreeLeafTemplateDirective<T>>(
    TreeLeafTemplateDirective<T>,
  )

  readonly branchTemplate = computed(() => {
    const branchInput = this.renderBranch()
    const branchTemplate = this.treeBranchContentChild()
    return branchInput || branchTemplate?.template
  })

  readonly leafTemplate = computed(() => {
    const leafInput = this.renderLeaf()
    const leafTemplate = this.treeLeafContentChild()
    return (leafInput || leafTemplate?.template) as TemplateRef<any>
  })

  protected treeContext = useTreeContext()
  readonly injector = inject(Injector, {self: true})

  readonly templateContext = computed<TreeNodeTemplateContext<T>>(() => ({
    $implicit: {
      indexPath: this.indexPath(),
      node: this.node(),
    },
  }))

  readonly childNodes = computed(() => {
    return this.treeContext().collection.getNodeChildren(this.node())
  })

  protected readonly treeNodePropsContextService = inject(
    TreeNodePropsContextService,
    {self: true},
  )

  protected treeNodeStateContextService = inject(TreeNodeStateContextService, {
    self: true,
  })

  ngOnInit() {
    const nodeProps = computed(() => ({
      indexPath: this.indexPath(),
      node: this.node(),
    }))
    this.treeNodePropsContextService.init(nodeProps)
    this.treeNodeStateContextService.init(
      computed(() => this.treeContext().getNodeState(nodeProps())),
    )
  }

  getChildIndexPath(index: number) {
    return [...this.indexPath(), index]
  }
}
