// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getFileMimeType} from "./get-file-mime-type"
import type {FileError} from "./types"

function isFileAccepted(
  file: File | null,
  accept: string[] | string | undefined,
) {
  if (file && accept) {
    const types = Array.isArray(accept) ? accept : accept.split(",")

    if (types.length === 0) {
      return true
    }

    const fileName = file.name || ""
    const mimeType = (
      file.type ||
      getFileMimeType(fileName) ||
      ""
    ).toLowerCase()
    const baseMimeType = mimeType.replace(/\/.*$/, "")

    return types.some((type) => {
      const validType = type.trim().toLowerCase()

      if (validType.charAt(0) === ".") {
        return fileName.toLowerCase().endsWith(validType)
      }

      if (validType.endsWith("/*")) {
        return baseMimeType === validType.replace(/\/.*$/, "")
      }

      return mimeType === validType
    })
  }
  return true
}

export function isValidFileType(
  file: File,
  accept: string | undefined,
): [boolean, FileError | null] {
  const isAcceptable =
    file.type === "application/x-moz-file" || isFileAccepted(file, accept)
  return [isAcceptable, isAcceptable ? null : "FILE_INVALID_TYPE"]
}
