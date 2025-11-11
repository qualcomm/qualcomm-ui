// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useRef, useState} from "react"

import {flushSync} from "react-dom"

import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {identity} from "@qualcomm-ui/utils/functions"
import {isFunction} from "@qualcomm-ui/utils/guard"
import type {
  Bindable,
  BindableParams,
  EventDetails,
} from "@qualcomm-ui/utils/machine"

export function useBindable<T, ChangeEvent extends EventDetails | void | null>(
  props: () => BindableParams<T, ChangeEvent>,
): Bindable<T, ChangeEvent> {
  const initial = props().value ?? props().defaultValue

  const eq = props().isEqual ?? Object.is

  const [initialValue] = useState(initial)
  const [value, setValue] = useState(initialValue)

  const controlled = props().value !== undefined

  const valueRef = useRef(value)
  valueRef.current = controlled ? props().value : value

  const prevValue = useRef(valueRef.current)
  useSafeLayoutEffect(() => {
    prevValue.current = valueRef.current
  }, [value, props().value])

  const setFn = (value: T | ((prev: T) => T), event: ChangeEvent) => {
    const prev = prevValue.current
    const next = isFunction(value) ? value(prev as T) : value

    if (!controlled) {
      setValue(next)
    }
    if (!eq(next, prev)) {
      props().onChange?.(next, event, prev)
    }
  }

  function get(): T {
    return (controlled ? props().value : value) as T
  }

  return {
    get,
    hash(value: T) {
      return props().hash?.(value) ?? String(value)
    },
    initial: initialValue,
    invoke(nextValue: T, prevValue: T) {
      props().onChange?.(nextValue, null as any, prevValue)
    },
    ref: valueRef,
    set(value: T | ((prev: T) => T), event: any) {
      const exec = props().sync ? flushSync : identity
      exec(() => setFn(value, event))
    },
  }
}
