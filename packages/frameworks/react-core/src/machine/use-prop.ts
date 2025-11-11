// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useRef} from "react"

/**
 * Unlike state variables, updating a ref doesn't trigger a re-render. The ref
 * always contains the most recent value, even in closure contexts like event
 * handlers or effects. This creates a stable reference that doesn't change between
 * renders.
 */
export function useLiveRef<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  ref.current = value
  return ref
}

/**
 * This hook provides a way to access the latest prop values in React components,
 * particularly in scenarios where you need to reference them in callbacks, effects,
 * or other asynchronous contexts.
 */
export function useProp<T>(value: T) {
  const ref = useLiveRef(value)
  return function get<K extends keyof T>(key: K): T[K] {
    return ref.current[key]
  }
}
