// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {dataTypes, PrimitiveType} from "./data-type"
import {getPreviewOptions, ROOT_KEY} from "./node-conversion"
import type {JsonNode, JsonNodePreviewOptions} from "./types"

export interface JsonToTreeOptions {
  depth?: number | undefined
  keyPath?: (string | number)[] | undefined
  options?: JsonNodePreviewOptions | undefined
  visited?: WeakSet<WeakKey> | undefined
}

const MAX_DEPTH = 20

export const jsonToTree = (
  data: unknown,
  props: JsonToTreeOptions = {},
): JsonNode => {
  const {depth = 0, keyPath = [ROOT_KEY], visited = new WeakSet()} = props
  const options = getPreviewOptions(props.options)

  // Prevent infinite recursion by limiting depth
  if (depth > MAX_DEPTH) {
    return {
      keyPath,
      type: "string",
      value: "[Max Depth Reached]",
    }
  }

  if (data && typeof data === "object") {
    if (visited.has(data)) {
      return {
        keyPath,
        type: "circular",
        value: "[Circular Reference]",
      }
    }
    visited.add(data)
  }

  const dataType =
    dataTypes.find((dataType) => dataType.check(data)) || PrimitiveType
  return dataType.node({
    createNode: (nestedKeyPath, value) =>
      jsonToTree(value, {
        depth: depth + 1,
        keyPath: [...keyPath, ...nestedKeyPath],
        options,
        visited,
      }),
    keyPath,
    options,
    value: data,
  })
}
