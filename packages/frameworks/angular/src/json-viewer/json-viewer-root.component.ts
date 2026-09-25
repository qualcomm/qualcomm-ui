// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Component,
  computed,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {provideQdsTreeContext} from "@qualcomm-ui/angular/tree"
import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import {provideTreeContext} from "@qualcomm-ui/angular-core/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {
  getPreviewOptions,
  getRootNode,
  type JsonNode,
  nodeToString,
  nodeToValue,
} from "@qualcomm-ui/utils/json-tree"

import {
  type JsonViewerOptions,
  JsonViewerOptionsContextService,
  provideJsonViewerOptionsContext,
} from "./json-viewer-options-context.service"

@Component({
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideQdsTreeContext(),
    provideJsonViewerOptionsContext(),
  ],
  selector: "q-json-viewer-root",
  standalone: false,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <div
      q-json-viewer-tree-root
      [class]="rootClass"
      [collection]="collection()"
      [defaultExpandedValue]="defaultExpandedValue()"
      [expandedValue]="expandedValue()"
      [typeahead]="false"
      (expandedValueChanged)="expandedValueChange.emit($event.expandedValue)"
    >
      <ng-content />
    </div>
  `,
})
export class JsonViewerRootComponent implements OnInit {
  /**
   * The data to display in the JSON viewer. Accepts any JavaScript value.
   */
  readonly data = input.required<unknown>()

  /**
   * The default depth to expand the tree to.
   *
   * @default 0
   */
  readonly defaultExpandedDepth = input<number>(0)

  /**
   * Controlled expanded values. When set, overrides internal expansion state.
   */
  readonly expandedValue = input<string[]>()

  /**
   * Whether to wrap property keys in double quotes.
   *
   * @default false
   */
  readonly quotesOnKeys = input<boolean>()

  /**
   * Maximum number of items shown in a collapsed container preview.
   *
   * @default 3
   */
  readonly maxPreviewItems = input<number>()

  /**
   * Truncates string values longer than this character count in the preview.
   *
   * @default 30
   */
  readonly collapseStringsAfterLength = input<number>()

  /**
   * Groups array entries into chunks when the array length exceeds this value.
   *
   * @default 100
   */
  readonly groupArraysAfterLength = input<number>()

  /**
   * Whether to display non-enumerable properties (e.g. prototype methods).
   *
   * @default true
   */
  readonly showNonenumerable = input<boolean>()

  /**
   * Emits the updated expanded values when the expansion state changes.
   */
  readonly expandedValueChange = output<string[]>()

  protected readonly rootClass = jsonViewerClasses.root

  protected readonly options = computed<JsonViewerOptions>(() => {
    const opts: JsonViewerOptions = {}
    const quotesOnKeys = this.quotesOnKeys()
    const maxPreviewItems = this.maxPreviewItems()
    const collapseStringsAfterLength = this.collapseStringsAfterLength()
    const groupArraysAfterLength = this.groupArraysAfterLength()
    const showNonenumerable = this.showNonenumerable()

    if (quotesOnKeys != null) {
      opts.quotesOnKeys = quotesOnKeys
    }
    if (maxPreviewItems != null) {
      opts.maxPreviewItems = maxPreviewItems
    }
    if (collapseStringsAfterLength != null) {
      opts.collapseStringsAfterLength = collapseStringsAfterLength
    }
    if (groupArraysAfterLength != null) {
      opts.groupArraysAfterLength = groupArraysAfterLength
    }
    if (showNonenumerable != null) {
      opts.showNonenumerable = showNonenumerable
    }

    return opts
  })

  protected readonly previewOptions = computed(() =>
    getPreviewOptions(this.options()),
  )

  protected readonly collection = computed(() =>
    createTreeCollection<JsonNode>({
      nodeChildren: "children",
      nodeText: nodeToString,
      nodeValue: nodeToValue,
      rootNode: getRootNode(this.data(), this.previewOptions()),
    }),
  )

  protected readonly defaultExpandedValue = computed(() => {
    return this.collection().getBranchValues(undefined, {
      depth: (nodeDepth) => nodeDepth <= this.defaultExpandedDepth(),
    })
  })

  private readonly optionsService = inject(JsonViewerOptionsContextService)

  ngOnInit() {
    this.optionsService.init(this.options)
  }
}
