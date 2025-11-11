// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {signal} from "@angular/core"

import type {BindableId} from "@qualcomm-ui/utils/machine"

export function bindableId(
  initialValue: string | undefined,
): BindableId<string | undefined> {
  // this value won't trigger change detection, but signals do
  let cachedValue = initialValue
  const value = signal(initialValue)

  return {
    get(): string | undefined {
      return value()
    },
    set(v: string | undefined) {
      if (cachedValue === v) {
        return
      }
      cachedValue = v
      value.set(v)
    },
  }
}
