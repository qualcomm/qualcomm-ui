// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

function isMIMEType(v: string) {
  return (
    v === "audio/*" ||
    v === "video/*" ||
    v === "image/*" ||
    v === "text/*" ||
    /\w+\/[-+.\w]+/g.test(v)
  )
}

function isExt(v: string) {
  return /^.*\.\w+$/.test(v)
}

const isValidMIME = (v: string) => isMIMEType(v) || isExt(v)

export function getAcceptAttrString(
  accept: Record<string, string[]> | string | string[] | undefined,
): string | undefined {
  if (accept == null) {
    return
  }

  if (typeof accept === "string") {
    return accept
  }

  if (Array.isArray(accept)) {
    return accept.filter(isValidMIME).join(",")
  }

  return Object.entries(accept)
    .reduce((a, [mimeType, ext]) => [...a, mimeType, ...ext], [] as string[])
    .filter(isValidMIME)
    .join(",")
}
