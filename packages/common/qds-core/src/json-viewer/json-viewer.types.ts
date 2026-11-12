// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  JsonNodePreviewOptions,
  JsonNodeSyntaxKind,
  JsonNodeType,
} from "@qualcomm-ui/utils/json-tree"

import type {jsonViewerClasses} from "./json-viewer.classes.js"

type JsonViewerClasses = typeof jsonViewerClasses

export interface QdsJsonViewerOptions extends Partial<JsonNodePreviewOptions> {
  /**
   * Whether to wrap property keys in double quotes.
   *
   * @default false
   */
  quotesOnKeys?: boolean

  /**
   * Whether to show opening and closing brackets around expanded branches.
   * Does not affect collapsed previews.
   *
   * @default true
   */
  showExpandedBrackets?: boolean
}

export interface QdsJsonViewerApiProps extends QdsJsonViewerOptions {
  /**
   * The data to display in the JSON viewer. Accepts any JavaScript value.
   */
  data: unknown

  /**
   * Expands branches up to this depth initially, without requiring explicit
   * node IDs in `defaultExpandedValue`.
   *
   * Ignored when `defaultExpandedValue` is provided.
   *
   * @default 0
   */
  defaultExpandedDepth?: number
}

export interface QdsJsonViewerValueBindingProps {
  kind?: JsonNodeSyntaxKind
  nodeType?: JsonNodeType
  root?: boolean
}

export interface QdsJsonViewerKeyBindingProps {
  isNonEnumerable?: boolean
}

export interface QdsJsonViewerValueBindings {
  className?: JsonViewerClasses["value"]
  "data-kind"?: JsonNodeSyntaxKind
  "data-root"?: BooleanDataAttr
  "data-type"?: JsonNodeType
}

export interface QdsJsonViewerKeyBindings {
  className: JsonViewerClasses["key"]
  "data-non-enumerable"?: BooleanDataAttr
}

export interface QdsJsonViewerColonBindings {
  className: JsonViewerClasses["colon"]
}

export interface QdsJsonViewerClosingBracketBindings {
  className: JsonViewerClasses["closingBracket"]
}

export interface QdsJsonViewerApi {
  getClosingBracketBindings(): QdsJsonViewerClosingBracketBindings
  getColonBindings(): QdsJsonViewerColonBindings
  getKeyBindings(props: QdsJsonViewerKeyBindingProps): QdsJsonViewerKeyBindings
  getValueBindings(
    props: QdsJsonViewerValueBindingProps,
  ): QdsJsonViewerValueBindings
}
