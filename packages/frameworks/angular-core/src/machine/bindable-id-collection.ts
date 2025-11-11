// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {signal} from "@angular/core"

import type {BindableIdCollection, Dict} from "@qualcomm-ui/utils/machine"

export function bindableIdCollection<T extends Dict>(): BindableIdCollection<
  any,
  any
> {
  const collection = signal<Record<string, T>>({})

  return {
    get(itemKey: string): T | undefined {
      return collection()[itemKey]
    },
    getAll(): Record<string, T> {
      const result: Record<string, T> = {}
      const current = collection()
      for (const key in current) {
        result[key] = current[key]
      }
      return result
    },
    keys(): string[] {
      return Object.keys(collection())
    },
    register(
      itemKey: string,
      value: T,
      onDestroy?: (callback: () => void) => void,
    ) {
      const current = collection()
      if (current[itemKey] === value) {
        return
      }

      if (onDestroy) {
        onDestroy(() => {
          const currentState = collection()
          const {[itemKey]: _removed, ...rest} = currentState
          collection.set(rest)
        })
      }

      collection.update((prevState) => ({
        ...prevState,
        [itemKey]: value,
      }))
    },
    remove(itemKey: string) {
      const current = collection()
      const {[itemKey]: _removed, ...rest} = current
      collection.set(rest)
    },
    set(itemKey: string, value: T) {
      collection.update((prev) => ({
        ...prev,
        [itemKey]: value,
      }))
    },
  }
}
