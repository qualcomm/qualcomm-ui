// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {provideTreeContext} from "@qualcomm-ui/angular-core/tree"
import {
  provideQdsTreeContext,
  QdsTreeRootBaseDirective,
} from "@qualcomm-ui/angular/tree"
import {
  createJsonViewerCollection,
  getJsonViewerDefaultExpandedValue,
  jsonViewerClasses,
  type QdsJsonViewerApiProps,
  type QdsJsonViewerOptions,
} from "@qualcomm-ui/qds-core/json-viewer"
import {getPreviewOptions, type JsonNode} from "@qualcomm-ui/utils/json-tree"

import {
  JsonViewerOptionsContextService,
  provideJsonViewerOptionsContext,
} from "./json-viewer-options-context.service"

@Directive({
  exportAs: "jsonViewerRoot",
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideQdsTreeContext(),
    provideJsonViewerOptionsContext(),
  ],
  selector: "[q-json-viewer-root]",
  standalone: false,
})
export class JsonViewerRootDirective
  extends QdsTreeRootBaseDirective<JsonNode>
  implements SignalifyInput<QdsJsonViewerApiProps>, OnInit
{
  /**
   * The data to display in the JSON viewer. Accepts any JavaScript value.
   */
  readonly data = input.required<unknown>()

  /**
   * Expands branches up to this depth initially, without requiring explicit
   * node IDs in `defaultExpandedValue`.
   *
   * Ignored when `defaultExpandedValue` is provided.
   *
   * @default 0
   */
  readonly defaultExpandedDepth = input<number>(0)

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
   * Use a positive integer, or 0 to disable grouping. Invalid values default to 100.
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

  protected readonly options = computed<QdsJsonViewerOptions>(() => {
    const opts: QdsJsonViewerOptions = {}
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

  /**
   * The collection of JSON nodes. Access through `jsonViewerRoot` for
   * programmatic operations such as expanding all branches.
   */
  override readonly collection = computed(() =>
    createJsonViewerCollection(this.data(), this.previewOptions()),
  )

  protected override readonly resolvedDefaultExpandedValue = computed(
    () =>
      this.defaultExpandedValue() ??
      getJsonViewerDefaultExpandedValue(
        this.collection(),
        this.defaultExpandedDepth(),
      ),
  )

  private readonly optionsService = inject(JsonViewerOptionsContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(() => ({class: jsonViewerClasses.root}))
  }

  override ngOnInit() {
    this.optionsService.init(this.options)

    super.ngOnInit()
  }
}
