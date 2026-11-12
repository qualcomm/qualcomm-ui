// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideChevronRight} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {useTreeContext} from "@qualcomm-ui/angular-core/tree"
import type {TreeApi} from "@qualcomm-ui/core/tree"
import {
  createQdsJsonViewerApi,
  getJsonViewerClosingBracket,
} from "@qualcomm-ui/qds-core/json-viewer"
import {
  getAccessibleDescription,
  getPreviewOptions,
  type JsonNode,
  type JsonNodeHastElement,
  jsonNodeToElement,
  keyPathToKey,
} from "@qualcomm-ui/utils/json-tree"

import {useJsonViewerOptionsContext} from "./json-viewer-options-context.service"

const qdsApi = createQdsJsonViewerApi(normalizeProps)

@Component({
  selector: "[q-json-viewer-tree]",
  standalone: false,
  template: `
    <ng-template #branchEnd let-branch>
      @if (showExpandedBrackets()) {
        @if (closingBracket(branch.node); as bracket) {
          <div aria-hidden="true" [q-bind]="closingBracketBindings">
            <q-json-viewer-value-node [node]="bracket" />
          </div>
        }
      }
    </ng-template>
    @for (child of children(); let i = $index; track trackChild(child)) {
      <q-tree-nodes
        [indexPath]="[i]"
        [node]="child"
        [renderBranchEnd]="branchEnd"
        [showIndentGuide]="indentGuide()"
      >
        <ng-template
          let-branch
          q-tree-branch-template
          [rootNode]="collection().rootNode"
        >
          <div q-tree-branch-node [attr.aria-label]="describe(branch.node)">
            @if (arrow()) {
              <div q-tree-branch-trigger [icon]="arrow()"></div>
            }
            <span
              q-tree-node-text
              [attr.data-show-expanded-brackets]="showExpandedBrackets()"
            >
              @if (hasKey(branch.node)) {
                <q-json-viewer-key-node
                  [node]="branch.node"
                  [showQuotes]="showQuotes()"
                />
              }
              <q-json-viewer-value-node [node]="toElement(branch.node)" />
            </span>
          </div>
        </ng-template>
        <ng-template
          let-leaf
          q-tree-leaf-template
          [rootNode]="collection().rootNode"
        >
          <div q-tree-leaf-node [attr.aria-label]="describe(leaf.node)">
            <span q-tree-node-text>
              @if (hasKey(leaf.node)) {
                <q-json-viewer-key-node
                  [node]="leaf.node"
                  [showQuotes]="showQuotes()"
                />
              }
              <q-json-viewer-value-node [node]="toElement(leaf.node)" />
            </span>
          </div>
        </ng-template>
      </q-tree-nodes>
    }
  `,
})
export class JsonViewerTreeDirective {
  /**
   * Icon used for the branch expand/collapse trigger.
   *
   * @default LucideChevronRight
   */
  readonly arrow = input<LucideIconOrString>(LucideChevronRight)

  /**
   * Whether to render vertical indent guidelines for nested levels.
   *
   * @default true
   */
  readonly indentGuide = input<boolean>(true)

  protected readonly closingBracketBindings = qdsApi.getClosingBracketBindings()

  protected readonly treeContext = useTreeContext() as () => TreeApi<JsonNode>

  protected readonly collection = computed(() => this.treeContext().collection)

  protected readonly jsonOptions = useJsonViewerOptionsContext()

  protected readonly previewOptions = computed(() =>
    getPreviewOptions(this.jsonOptions() ?? {}),
  )

  protected readonly showQuotes = computed(
    () => this.jsonOptions()?.quotesOnKeys,
  )

  protected readonly showExpandedBrackets = computed(
    () => this.jsonOptions()?.showExpandedBrackets ?? true,
  )

  protected readonly children = computed(() => {
    const ctx = this.treeContext()
    return ctx.collection.getNodeChildren(ctx.collection.rootNode)
  })

  protected trackChild(child: JsonNode): string {
    return this.collection().getNodeValue(child)
  }

  protected hasKey(node: JsonNode): boolean {
    return !!keyPathToKey(node.keyPath, {excludeRoot: true})
  }

  protected describe(node: JsonNode): string {
    return getAccessibleDescription(node, this.previewOptions())
  }

  protected toElement(node: JsonNode): JsonNodeHastElement {
    return jsonNodeToElement(node, this.previewOptions())
  }

  protected closingBracket(node: JsonNode): JsonNodeHastElement | undefined {
    return getJsonViewerClosingBracket(this.toElement(node))
  }
}
