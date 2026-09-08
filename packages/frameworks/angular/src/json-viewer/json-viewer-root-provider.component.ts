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
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
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

export interface JsonViewerState {
  /**
   * The tree data structure built from `data`. Use for programmatic tree
   * operations like querying branch values for expand/collapse control.
   */
  collection: TreeCollection<JsonNode>

  /**
   * Array of node values to expand by default, derived from `defaultExpandedDepth`.
   * Pass to `[expandedValue]` as the initial controlled value.
   */
  defaultExpandedValue: string[] | undefined

  /**
   * Display formatting options for the viewer.
   */
  options: JsonViewerOptions
}

export interface CreateJsonViewerStateOptions extends JsonViewerOptions {
  /**
   * The data to display in the JSON viewer. Accepts any JavaScript value.
   */
  data: unknown

  /**
   * The default depth to expand the tree to.
   *
   * @default 0
   */
  defaultExpandedDepth?: number
}

/**
 * Creates pre-computed JSON viewer state for use with `q-json-viewer-root-provider`.
 */
export function createJsonViewerState(
  opts: CreateJsonViewerStateOptions,
): JsonViewerState {
  const {
    collapseStringsAfterLength,
    data,
    defaultExpandedDepth = 0,
    groupArraysAfterLength,
    maxPreviewItems,
    quotesOnKeys,
    showNonenumerable,
  } = opts

  const options: JsonViewerOptions = {
    collapseStringsAfterLength,
    groupArraysAfterLength,
    maxPreviewItems,
    quotesOnKeys,
    showNonenumerable,
  }

  const previewOptions = getPreviewOptions(options)

  const collection = createTreeCollection<JsonNode>({
    nodeChildren: "children",
    nodeText: nodeToString,
    nodeValue: nodeToValue,
    rootNode: getRootNode(data, previewOptions),
  })

  const defaultExpandedValue =
    defaultExpandedDepth != null
      ? collection.getBranchValues(undefined, {
          depth: (nodeDepth) => nodeDepth <= defaultExpandedDepth,
        })
      : undefined

  return {
    collection,
    defaultExpandedValue,
    options,
  }
}

@Component({
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideQdsTreeContext(),
    provideJsonViewerOptionsContext(),
  ],
  selector: "q-json-viewer-root-provider",
  standalone: false,
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
export class JsonViewerRootProviderComponent implements OnInit {
  /**
   * Pre-computed state from `createJsonViewerState`. Use this when you need to
   * access the viewer state outside the component tree.
   */
  readonly value = input.required<JsonViewerState>()

  /**
   * Controlled expanded values. When set, overrides internal expansion state.
   */
  readonly expandedValue = input<string[]>()

  /**
   * Emits the updated expanded values when the expansion state changes.
   */
  readonly expandedValueChange = output<string[]>()

  protected readonly rootClass = jsonViewerClasses.root
  protected readonly collection = computed(() => this.value().collection)
  protected readonly defaultExpandedValue = computed(
    () => this.value().defaultExpandedValue,
  )

  private readonly optionsService = inject(JsonViewerOptionsContextService)
  private readonly options = computed(() => this.value().options)

  ngOnInit() {
    this.optionsService.init(this.options)
  }
}
