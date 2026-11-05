// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear
import {mimeTypesMap} from "./mime-types.js"
import type {FileMimeType} from "./types.js"

export function getFileMimeType(name: string): FileMimeType | null {
  const extension = name.split(".").pop()
  return extension ? mimeTypesMap.get(extension) || null : null
}
