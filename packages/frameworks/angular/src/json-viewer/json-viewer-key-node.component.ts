// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {createQdsJsonViewerApi} from "@qualcomm-ui/qds-core/json-viewer"
import {type JsonNode, keyPathToKey} from "@qualcomm-ui/utils/json-tree"

const qdsApi = createQdsJsonViewerApi(normalizeProps)

@Component({
  selector: "q-json-viewer-key-node",
  standalone: false,
  template: `
    <span [q-bind]="keyBindings()">
      {{ displayKey() }}
    </span>
    <span [q-bind]="colonBindings">{{ ": " }}</span>
  `,
})
export class JsonViewerKeyNodeComponent {
  readonly node = input.required<JsonNode>()
  readonly showQuotes = input<boolean>()

  protected readonly colonBindings = qdsApi.getColonBindings()

  protected readonly keyBindings = computed(() =>
    qdsApi.getKeyBindings({isNonEnumerable: this.node().isNonEnumerable}),
  )

  protected readonly displayKey = computed(() => {
    const key = keyPathToKey(this.node().keyPath)
    return this.showQuotes() ? `"${key}"` : key
  })
}
