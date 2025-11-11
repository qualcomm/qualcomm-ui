// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {signal} from "@angular/core"

export function createRefs<T>(refs: T) {
  const ref = signal<T>(refs)

  return {
    get<K extends keyof T>(key: K): T[K] {
      return ref()[key]
    },
    set<K extends keyof T>(key: K, value: T[K]) {
      ref.update((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
  }
}
