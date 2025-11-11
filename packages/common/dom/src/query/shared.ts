// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function clamp(value: number): number {
  return Math.max(0, Math.min(1, value))
}

export function wrap<T>(v: T[], idx: number): T[] {
  return v.map((_, index) => v[(Math.max(idx, 0) + index) % v.length])
}

export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg)
}

export const MAX_Z_INDEX = 2147483647

export function sanitize(str: string): string {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code > 0 && code < 128) {
        return char
      }
      if (code >= 128 && code <= 255) {
        return `/x${code.toString(16)}`.replace("/", "\\")
      }
      return ""
    })
    .join("")
    .trim()
}
