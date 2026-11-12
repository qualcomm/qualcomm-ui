// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {
  getRootNode,
  type JsonNode,
  type JsonNodeElement,
  type JsonNodeHastElement,
  type JsonNodePreviewOptions,
  keyPathToKey,
  nodeToString,
  nodeToValue,
} from "@qualcomm-ui/utils/json-tree"

import type {QdsJsonViewerOptions} from "./json-viewer.types.js"

export const JSON_VIEWER_OPTION_KEYS: readonly (keyof QdsJsonViewerOptions)[] =
  [
    "collapseStringsAfterLength",
    "groupArraysAfterLength",
    "maxPreviewItems",
    "quotesOnKeys",
    "showExpandedBrackets",
    "showNonenumerable",
  ]

/**
 * Builds a tree collection from any JavaScript value using JSON Viewer node
 * mappings and preview options.
 */
export function createJsonViewerCollection(
  data: unknown,
  options?: Partial<JsonNodePreviewOptions>,
): TreeCollection<JsonNode> {
  return createTreeCollection<JsonNode>({
    nodeChildren: "children",
    nodeText: nodeToString,
    nodeValue: nodeToValue,
    rootNode: getRootNode(data, options),
  })
}

/**
 * Returns the branch node IDs to expand initially for the specified depth.
 */
export function getJsonViewerDefaultExpandedValue(
  collection: TreeCollection<JsonNode>,
  depth = 0,
): string[] {
  return collection.getBranchValues(undefined, {
    depth: (nodeDepth) => nodeDepth <= depth,
  })
}

/**
 * Returns a property key with optional surrounding double quotes.
 */
export function getJsonViewerKeyText(
  node: JsonNode,
  quotesOnKeys = false,
): string {
  const key = keyPathToKey(node.keyPath)
  return quotesOnKeys ? `"${key}"` : key
}

/**
 * Returns the preview's closing bracket for rendering after expanded children.
 * Previews without an outer bracket do not need a closing row.
 */
export function getJsonViewerClosingBracket(
  element: JsonNodeHastElement,
): JsonNodeElement | undefined {
  if (element.type !== "element") {
    return undefined
  }
  const lastChild = element.children.at(-1)
  return lastChild?.type === "element" &&
    lastChild.properties.kind === "closing-brace"
    ? lastChild
    : undefined
}
