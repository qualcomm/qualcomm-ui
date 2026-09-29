// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTreeContext} from "@qualcomm-ui/angular-core/tree"
import type {JsonNode} from "@qualcomm-ui/utils/json-tree"

@Component({
  selector: "q-json-viewer-tree",
  standalone: false,
  template: `
    @for (child of children(); let i = $index; track trackChild(child)) {
      <q-json-viewer-node
        [arrow]="arrow()"
        [indentGuide]="indentGuide()"
        [indexPath]="[i]"
        [node]="child"
      />
    }
  `,
})
export class JsonViewerTreeComponent {
  /**
   * Icon used for the branch expand/collapse trigger.
   *
   * @default ChevronRight
   */
  readonly arrow = input<LucideIconOrString>(ChevronRight)

  /**
   * Whether to render vertical indent guidelines for nested levels.
   *
   * @default true
   */
  readonly indentGuide = input<boolean>(true)

  protected readonly treeContext = useTreeContext()

  protected readonly children = computed(() => {
    const ctx = this.treeContext()
    return ctx.collection.getNodeChildren(ctx.collection.rootNode)
  })

  protected trackChild(child: JsonNode): string {
    return this.treeContext().collection.getNodeValue(child)
  }
}
