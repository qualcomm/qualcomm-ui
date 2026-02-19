// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type JsonNodeType =
  | "object"
  | "array"
  | "boolean"
  | "number"
  | "string"
  | "null"
  | "set"
  | "map"
  | "weakset"
  | "weakmap"
  | "regex"
  | "date"
  | "undefined"
  | "symbol"
  | "bigint"
  | "arraybuffer"
  | "sharedarraybuffer"
  | "buffer"
  | "dataview"
  | "blob"
  | "file"
  | "url"
  | "urlsearchparams"
  | "formdata"
  | "promise"
  | "headers"
  | "int8array"
  | "uint8array"
  | "uint8clampedarray"
  | "int16array"
  | "uint16array"
  | "int32array"
  | "uint32array"
  | "float32array"
  | "float64array"
  | "bigint64array"
  | "biguint64array"
  | "iterable"
  | "error"
  | "function"
  | "circular"
  | "element"
  | "document"
  | "window"
  | "react-element"

export type JsonNodeKeyPath = (string | number)[]

export type JsonNodeSyntaxKind =
  | "constructor"
  | "brace"
  | "preview"
  | "preview-text"
  | "function-type"
  | "function-body"
  | "colon"
  | "circular"
  | "operator"
  | "error-stack"

// Hast-compatible element interface
export interface JsonNodeElement {
  children: Array<JsonNodeElement | JsonNodeText>
  properties: {
    [key: string]: any
    kind?: JsonNodeSyntaxKind
    nodeType?: JsonNodeType
    root?: boolean
  }
  tagName: "span" | "div" | "a"
  type: "element"
}

// Hast-compatible text node interface
export interface JsonNodeText {
  type: "text"
  value: string | number | boolean | null | undefined
}

// Union type for all node types
export type JsonNodeHastElement = JsonNodeElement | JsonNodeText

export interface JsonNode<T = any> {
  /** @inheritDoc */
  children?: JsonNode[]
  constructorName?: string | undefined
  isNonEnumerable?: boolean
  keyPath: JsonNodeKeyPath
  propertyDescriptor?: PropertyDescriptor | undefined
  /** @inheritDoc */
  type: JsonNodeType
  value: T
}

export interface JsonNodePreviewOptions {
  /**
   * Truncates string values longer than this character count in the preview.
   *
   * @default 30
   */
  collapseStringsAfterLength: number

  /**
   * Groups array entries into chunks when the array length exceeds this value.
   *
   * @default 100
   */
  groupArraysAfterLength: number

  /**
   * Maximum number of items shown in a collapsed container preview.
   *
   * @default 3
   */
  maxPreviewItems: number

  /**
   * Whether to display non-enumerable properties (e.g. prototype methods).
   *
   * @default true
   */
  showNonenumerable: boolean
}

export interface JsonDataTypeOptions<T = any> {
  check: (value: any) => boolean
  description:
    | string
    | ((node: JsonNode<T>, opts: JsonNodePreviewOptions) => string)
  node: JsonNodeCreatorFn<T>
  previewElement: (
    node: JsonNode<T>,
    opts: JsonNodePreviewOptions,
  ) => JsonNodeElement
  previewText?: (node: JsonNode<T>, opts: JsonNodePreviewOptions) => string
  type: JsonNodeType | ((value: T) => JsonNodeType)
}

export interface JsonNodeCreatorParams<T = any> {
  createNode: (keyPath: JsonNodeKeyPath, value: unknown) => JsonNode
  keyPath: JsonNodeKeyPath
  options: JsonNodePreviewOptions | undefined
  value: T
}

export type JsonNodeCreatorFn<T = any> = (
  opts: JsonNodeCreatorParams<T>,
) => JsonNode
