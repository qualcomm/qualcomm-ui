// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, input, type OnInit} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  provideTreeNodePropsContext,
  provideTreeNodeStateContext,
  TreeNodePropsContextService,
  TreeNodeStateContextService,
  useTreeContext,
} from "@qualcomm-ui/angular-core/tree"
import {
  getAccessibleDescription,
  getPreviewOptions,
  type JsonNode,
  jsonNodeToElement,
  keyPathToKey,
} from "@qualcomm-ui/utils/json-tree"

import {useJsonViewerOptionsContext} from "./json-viewer-options-context.service"

@Component({
  providers: [provideTreeNodePropsContext(), provideTreeNodeStateContext()],
  selector: "q-json-viewer-node",
  standalone: false,
  template: `
    @if (isBranch()) {
      <div q-tree-branch>
        <div q-tree-branch-node [attr.aria-label]="description()">
          @if (arrow()) {
            <button q-tree-branch-trigger [icon]="arrow()!"></button>
          }
          <span q-tree-node-text>
            @if (key()) {
              <q-json-viewer-key-node
                [node]="node()"
                [showQuotes]="showQuotes()"
              />
            }
            <q-json-viewer-value-node [node]="hastElement()" />
          </span>
        </div>
        <div q-tree-branch-content>
          @if (indentGuide()) {
            <div q-tree-branch-indent-guide></div>
          }
          @for (
            child of childNodes();
            let i = $index;
            track trackChild(child)
          ) {
            <q-json-viewer-node
              [arrow]="arrow()"
              [indentGuide]="indentGuide()"
              [indexPath]="getChildIndexPath(i)"
              [node]="child"
            />
          }
        </div>
      </div>
    } @else {
      <div q-tree-leaf-node [attr.aria-label]="description()">
        <span q-tree-node-text>
          @if (key()) {
            <q-json-viewer-key-node
              [node]="node()"
              [showQuotes]="showQuotes()"
            />
          }
          <q-json-viewer-value-node [node]="hastElement()" />
        </span>
      </div>
    }
  `,
})
export class JsonViewerNodeComponent implements OnInit {
  readonly indexPath = input.required<number[]>()
  readonly node = input.required<JsonNode>()
  readonly arrow = input<LucideIconOrString>()
  readonly indentGuide = input<boolean>()

  protected readonly treeContext = useTreeContext()
  protected readonly jsonOptions = useJsonViewerOptionsContext()

  protected readonly previewOptions = computed(() =>
    getPreviewOptions(this.jsonOptions() ?? {}),
  )

  private readonly nodeProps = computed(() => ({
    indexPath: this.indexPath(),
    node: this.node(),
  }))

  protected readonly nodeState = computed(() =>
    this.treeContext().getNodeState(this.nodeProps()),
  )

  protected readonly isBranch = computed(() => this.nodeState().isBranch)

  protected readonly key = computed(() =>
    keyPathToKey(this.node().keyPath, {excludeRoot: true}),
  )

  protected readonly hastElement = computed(() =>
    jsonNodeToElement(this.node(), this.previewOptions()),
  )

  protected readonly description = computed(() =>
    getAccessibleDescription(this.node(), this.previewOptions()),
  )

  protected readonly showQuotes = computed(
    () => this.jsonOptions()?.quotesOnKeys,
  )

  protected readonly childNodes = computed(() =>
    this.treeContext().collection.getNodeChildren(this.node()),
  )

  private readonly treeNodePropsContextService = inject(
    TreeNodePropsContextService,
    {self: true},
  )

  private readonly treeNodeStateContextService = inject(
    TreeNodeStateContextService,
    {self: true},
  )

  ngOnInit() {
    this.treeNodePropsContextService.init(this.nodeProps)
    this.treeNodeStateContextService.init(this.nodeState)
  }

  protected trackChild(child: JsonNode): string {
    return this.treeContext().collection.getNodeValue(child)
  }

  protected getChildIndexPath(index: number): number[] {
    return [...this.indexPath(), index]
  }
}
