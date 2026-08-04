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

import type {SideNavNodeTemplateContext} from "./qds-side-nav-context.service"
import {SideNavBranchTemplateDirective} from "./side-nav-branch-template.directive"
import {SideNavLeafTemplateDirective} from "./side-nav-leaf-template.directive"

@Component({
  providers: [provideTreeNodePropsContext(), provideTreeNodeStateContext()],
  selector: "q-side-nav-nodes",
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
      <div q-side-nav-branch>
        <ng-template
          [ngTemplateOutlet]="branchTemplate()!"
          [ngTemplateOutletContext]="templateContext()"
          [ngTemplateOutletInjector]="injector"
        />

        <div q-side-nav-branch-content>
          @if (showIndentGuide()) {
            <div q-side-nav-branch-indent-guide></div>
          }

          @for (
            child of childNodes();
            let i = $index;
            track treeContext().collection.getNodeValue(child)
          ) {
            <q-side-nav-nodes
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
export class SideNavNodesComponent<T extends TreeNode>
  implements SignalifyInput<NodeProps<T>>, OnInit
{
  /**
   * The index path of the tree node
   */
  readonly indexPath = input.required<number[]>()

  /**
   * The tree node
   */
  readonly node = input.required<T>()

  readonly showIndentGuide = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  readonly renderBranch =
    input<TemplateRef<SideNavBranchTemplateDirective<T>>>()

  readonly renderLeaf = input<TemplateRef<SideNavLeafTemplateDirective<T>>>()

  readonly sideNavBranchContentChild = contentChild<
    SideNavBranchTemplateDirective<T>
  >(SideNavBranchTemplateDirective<T>)

  readonly sideNavLeafContentChild = contentChild<
    SideNavLeafTemplateDirective<T>
  >(SideNavLeafTemplateDirective<T>)

  readonly branchTemplate = computed(() => {
    const branchInput = this.renderBranch()
    const branchTemplate = this.sideNavBranchContentChild()
    return branchInput || branchTemplate?.template
  })

  readonly leafTemplate = computed(() => {
    const leafInput = this.renderLeaf()
    const leafTemplate = this.sideNavLeafContentChild()
    return (leafInput || leafTemplate?.template) as TemplateRef<any>
  })

  protected treeContext = useTreeContext()
  readonly injector = inject(Injector, {self: true})

  readonly templateContext = computed<SideNavNodeTemplateContext<T>>(() => ({
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
