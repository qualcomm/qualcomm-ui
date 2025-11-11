// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function warn(m: string): void
export function warn(c: boolean, m: string): void
export function warn(...a: any[]): void {
  const m = a.length === 1 ? a[0] : a[1]
  const c = a.length === 2 ? a[0] : true
  if (c && process.env.NODE_ENV !== "production") {
    console.warn(m)
  }
}

export function invariant(m: string): void
export function invariant(c: boolean, m: string): void
export function invariant(...a: any[]): void {
  const m = a.length === 1 ? a[0] : a[1]
  const c = a.length === 2 ? a[0] : true
  if (c && process.env.NODE_ENV !== "production") {
    throw new Error(m)
  }
}
