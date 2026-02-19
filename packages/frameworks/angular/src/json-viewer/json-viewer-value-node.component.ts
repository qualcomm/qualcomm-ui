// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import type {JsonNodeHastElement} from "@qualcomm-ui/utils/json-tree"

@Component({
  selector: "q-json-viewer-value-node",
  standalone: false,
  template: `
    @if (isText()) {
      {{ textValue() }}
    } @else {
      @switch (tagName()) {
        @case ("a") {
          <a
            [attr.data-kind]="kind()"
            [attr.data-root]="isRoot() ? '' : null"
            [attr.data-type]="nodeType()"
            [class]="rootClass()"
          >
            @for (child of children(); track $index) {
              <q-json-viewer-value-node [node]="child" />
            }
          </a>
        }
        @case ("div") {
          <div
            [attr.data-kind]="kind()"
            [attr.data-root]="isRoot() ? '' : null"
            [attr.data-type]="nodeType()"
            [class]="rootClass()"
          >
            @for (child of children(); track $index) {
              <q-json-viewer-value-node [node]="child" />
            }
          </div>
        }
        @default {
          <span
            [attr.data-kind]="kind()"
            [attr.data-root]="isRoot() ? '' : null"
            [attr.data-type]="nodeType()"
            [class]="rootClass()"
          >
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

  protected readonly isRoot = computed(() => {
    const node = this.node()
    if (node.type !== "element") {
      return false
    }
    return node.properties.root || node.properties.nodeType != null
  })

  protected readonly kind = computed(() => {
    const node = this.node()
    return node.type === "element" ? node.properties.kind : undefined
  })

  protected readonly nodeType = computed(() => {
    const node = this.node()
    return node.type === "element" ? node.properties.nodeType : undefined
  })

  protected readonly children = computed(() => {
    const node = this.node()
    return node.type === "element" ? node.children : []
  })

  protected readonly rootClass = computed(() =>
    this.isRoot() ? jsonViewerClasses.value : undefined,
  )
}
