// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {type JsonNode, keyPathToKey} from "@qualcomm-ui/utils/json-tree"

@Component({
  selector: "q-json-viewer-key-node",
  standalone: false,
  template: `
    <span
      [attr.data-non-enumerable]="node().isNonEnumerable ? '' : null"
      [class]="keyClass"
    >
      {{ displayKey() }}
    </span>
    <span [class]="colonClass">{{ ": " }}</span>
  `,
})
export class JsonViewerKeyNodeComponent {
  readonly node = input.required<JsonNode>()
  readonly showQuotes = input<boolean>()

  protected readonly keyClass = jsonViewerClasses.key
  protected readonly colonClass = jsonViewerClasses.colon

  protected readonly displayKey = computed(() => {
    const key = keyPathToKey(this.node().keyPath)
    return this.showQuotes() ? `"${key}"` : key
  })
}
