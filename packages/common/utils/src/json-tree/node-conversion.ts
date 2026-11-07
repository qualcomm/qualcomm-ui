// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {jsonToTree} from "./json-to-tree.js"
import {defu, hash} from "./shared.js"
import type {JsonNode, JsonNodePreviewOptions} from "./types.js"

export const ROOT_KEY = "$"
export const PATH_SEP = "."

// //////////////////////////////////////////////////////////////////////////////////////////////////////

export function isRootKeyPath(keyPath: Array<string | number>): boolean {
  return keyPath.length === 1 && keyPath[0] === ROOT_KEY
}

/**
 * Serializes a node path, escaping dots and backslashes within each segment
 * so a property named "a.b" stays distinct from nested properties a.b
 */
export function keyPathToId(keyPath: Array<string | number>): string {
  return keyPath
    .map((segment) =>
      String(segment).replaceAll("\\", "\\\\").replaceAll(PATH_SEP, "\\."),
    )
    .join(PATH_SEP)
}

export function keyPathToKey(
  keyPath: Array<string | number>,
  opts?: {excludeRoot?: boolean},
): string {
  if (keyPath.length === 0) {
    return ""
  }
  if (opts?.excludeRoot && isRootKeyPath(keyPath)) {
    return ""
  }
  return String(keyPath[keyPath.length - 1])
}

export function nodeToValue(node: JsonNode): string {
  return hash(keyPathToId(node.keyPath))
}

/**
 * Returns the node value for an escaped path produced by keyPathToId.
 * Use keyPathToId when property names contain dots or backslashes.
 */
export function jsonPathToValue(path: string): string {
  return hash(path)
}

export function nodeToString(node: JsonNode): string {
  return keyPathToKey(node.keyPath) || "root"
}

export function getRootNode(
  data: unknown,
  opts?: Partial<JsonNodePreviewOptions>,
): JsonNode {
  return {
    children: [
      jsonToTree(data, {
        keyPath: [ROOT_KEY],
        options: getPreviewOptions(opts),
        visited: new WeakSet(),
      }),
    ],
    keyPath: [],
    type: "object",
    value: "",
  }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////

export const DEFAULT_PREVIEW_OPTIONS: JsonNodePreviewOptions = {
  collapseStringsAfterLength: 30,
  groupArraysAfterLength: 100,
  maxPreviewItems: 3,
  showNonenumerable: true,
}

export const getPreviewOptions = (
  opts?: Partial<JsonNodePreviewOptions>,
): JsonNodePreviewOptions => {
  if (!opts) {
    return DEFAULT_PREVIEW_OPTIONS
  }
  const options = defu(DEFAULT_PREVIEW_OPTIONS, opts)
  if (
    !Number.isInteger(options.groupArraysAfterLength) ||
    options.groupArraysAfterLength < 0
  ) {
    options.groupArraysAfterLength =
      DEFAULT_PREVIEW_OPTIONS.groupArraysAfterLength
  }
  return options
}
