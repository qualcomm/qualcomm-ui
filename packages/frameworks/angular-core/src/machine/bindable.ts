// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, effect, signal} from "@angular/core"

import {isFunction} from "@qualcomm-ui/utils/guard"
import type {
  Bindable,
  BindableParams,
  EventDetails,
} from "@qualcomm-ui/utils/machine"

export function bindable<T, ChangeEvent extends EventDetails | void | null>(
  props: () => BindableParams<T, ChangeEvent>,
): Bindable<T, ChangeEvent> {
  const initial = props().value ?? props().defaultValue

  const eq = props().isEqual ?? Object.is

  const value = signal(initial as T)
  const controlled = computed(() => props().value !== undefined)

  const valueRef = computed(() => (controlled() ? props().value! : value()))

  return {
    get(): T {
      return valueRef()
    },
    hash(value: T) {
      return props().hash?.(value) ?? String(value)
    },
    initial,
    invoke(nextValue: T, prevValue: T) {
      props().onChange?.(nextValue, null as ChangeEvent, prevValue)
    },
    ref: valueRef,
    set(v: T | ((prev: T) => T), event: ChangeEvent) {
      const prev = valueRef()
      const next = isFunction(v) ? v(prev) : v

      if (!controlled()) {
        value.set(next)
      }

      if (!eq(next, prev)) {
        props().onChange?.(next, event, prev)
      }
    },
  }
}

bindable.cleanup = (fn: VoidFunction) => {
  effect((onCleanup) => onCleanup(fn))
}

bindable.ref = <T>(defaultValue: T) => {
  let value = defaultValue

  return {
    get: () => value,
    set: (next: T) => {
      value = next
    },
  }
}
