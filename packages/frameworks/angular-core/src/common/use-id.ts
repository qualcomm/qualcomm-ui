// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

let counter = 0

export function useId(_component: object, id: string | undefined | null) {
  if (id) {
    return id
  }
  return `«auto::${(++counter).toString(32)}»`
}
