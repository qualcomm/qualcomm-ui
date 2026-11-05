// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Ref, type RefCallback, type RefObject, useMemo} from "react"

import {setRef} from "./set-ref.js"

export type ReactRef<T> = RefCallback<T> | RefObject<T>

export function assignRef<T = any>(
  ref: ReactRef<T> | null | undefined,
  value: T,
): void {
  if (ref == null) {
    return
  }

  if (typeof ref === "function") {
    ref(value)
    return
  }

  try {
    ref.current = value
  } catch {
    throw new Error("Cannot assign value to ref", {cause: value})
  }
}

export function mergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]) {
  return (node: T | null): void => {
    for (const ref of refs) {
      assignRef(ref, node)
    }
  }
}

/**
 * This hook combines multiple refs into a single callbackRef.
 */
export function useMergedRef<Instance>(
  ...refs: Array<Ref<Instance> | undefined>
): RefCallback<Instance> | null {
  /**
   * This will create a new function if the refs passed to this hook change and are
   * all defined. This means react will call the old forkRef with `null` and the new
   * forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null
    }

    return (instance) => {
      for (const ref of refs) {
        setRef(ref, instance)
      }
    }
    // TODO: determine whether changing this to a static array breaks this hook
    // eslint-disable-next-line react-hooks/exhaustive-deps,react-hooks/use-memo
  }, refs)
}
