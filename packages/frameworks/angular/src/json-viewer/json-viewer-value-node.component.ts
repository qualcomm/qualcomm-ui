// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {createQdsJsonViewerApi} from "@qualcomm-ui/qds-core/json-viewer"
import type {JsonNodeHastElement} from "@qualcomm-ui/utils/json-tree"

const qdsApi = createQdsJsonViewerApi(normalizeProps)

@Component({
  selector: "q-json-viewer-value-node",
  standalone: false,
  template: `
    @if (isText()) {
      {{ textValue() }}
    } @else {
      @switch (tagName()) {
        @case ("a") {
          <a [q-bind]="bindings()">
            @for (child of children(); track $index) {
              <q-json-viewer-value-node [node]="child" />
            }
          </a>
        }
        @case ("div") {
          <div [q-bind]="bindings()">
            @for (child of children(); track $index) {
              <q-json-viewer-value-node [node]="child" />
            }
          </div>
        }
        @default {
          <span [q-bind]="bindings()">
            @for (child of children(); track $index) {
              <q-json-viewer-value-node [node]="child" />
            }
          </span>
        }
      }
    }
  `,
})
export class JsonViewerValueNodeComponent {
  readonly node = input.required<JsonNodeHastElement>()

  protected readonly isText = computed(() => this.node().type === "text")

  protected readonly textValue = computed(() => {
    const node = this.node()
    return node.type === "text" ? node.value : undefined
  })

  protected readonly tagName = computed(() => {
    const node = this.node()
    return node.type === "element" ? node.tagName : undefined
  })

  protected readonly children = computed(() => {
    const node = this.node()
    return node.type === "element" ? node.children : []
  })

  protected readonly bindings = computed(() => {
    const node = this.node()
    if (node.type !== "element") {
      return qdsApi.getValueBindings({})
    }
    const isRoot = node.properties.root || node.properties.nodeType != null
    return qdsApi.getValueBindings({
      kind: node.properties.kind,
      nodeType: node.properties.nodeType,
      root: isRoot,
    })
  })
}
