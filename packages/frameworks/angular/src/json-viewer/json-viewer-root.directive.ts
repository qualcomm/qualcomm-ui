// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  provideRenderStrategyContext,
  RenderStrategyContextService,
} from "@qualcomm-ui/angular-core/presence"
import {
  provideTreeContext,
  TreeContextService,
} from "@qualcomm-ui/angular-core/tree"
import {
  provideQdsTreeContext,
  QdsTreeContextService,
} from "@qualcomm-ui/angular/tree"
import {
  createTreeApi,
  createTreeCollection,
  type TreeApiProps,
  treeMachine,
} from "@qualcomm-ui/core/tree"
import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {createQdsTreeApi} from "@qualcomm-ui/qds-core/tree"
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
export class JsonViewerRootDirective implements OnInit {
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

  /**
   * The collection of JSON nodes. Access through `jsonViewerRoot` for
   * programmatic operations such as expanding all branches.
   */
  readonly collection = computed(() =>
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

  /**
   * Controlled expanded values. When set, overrides internal expansion state.
   */
  readonly expandedValue = input<string[]>()

  /**
   * Emits the updated expanded values when the expansion state changes.
   */
  readonly expandedValueChange = output<string[]>()

  private readonly document = inject(DOCUMENT)
  private readonly injector = inject(Injector)
  private readonly isMounted = useIsMounted()
  private readonly hostId = computed(() => useId(this, undefined))
  private readonly treeService = inject(TreeContextService)
  private readonly qdsTreeService = inject(QdsTreeContextService)
  private readonly renderStrategyService = inject(RenderStrategyContextService)
  private readonly optionsService = inject(JsonViewerOptionsContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.treeService.context().getRootBindings({id: this.hostId()}),
  )

  constructor() {
    this.trackBindings.extendWith(() =>
      this.qdsTreeService.context().getRootBindings(),
    )
    this.trackBindings.extendWith(() => ({class: jsonViewerClasses.root}))
  }

  ngOnInit() {
    this.optionsService.init(this.options)
    this.qdsTreeService.init(
      computed(() => createQdsTreeApi({size: undefined}, normalizeProps)),
    )

    const machine = useMachine(
      treeMachine,
      computed<TreeApiProps<JsonNode>>(() => ({
        collection: this.collection(),
        defaultExpandedValue: this.defaultExpandedValue(),
        expandedValue: this.expandedValue(),
        getRootNode: () => this.document,
        onExpandedValueChange: ({expandedValue}) => {
          if (this.isMounted()) {
            this.expandedValueChange.emit(expandedValue)
          }
        },
        typeahead: false,
      })),
      this.injector,
    )

    this.treeService.init(
      computed(() => createTreeApi(machine, normalizeProps)),
    )
    this.renderStrategyService.init(
      computed(() => ({lazyMount: undefined, unmountOnExit: undefined})),
    )
    this.trackBindings()
  }
}
