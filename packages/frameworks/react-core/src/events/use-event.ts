// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useRef} from "react"

import type {AnyFunction} from "@qualcomm-ui/utils/guard"

export interface UseEventOptions {
  /**
   * Whether to use flushSync or not
   */
  sync?: boolean
}

/**
 * Returns a memoized callback that will flushSync the callback if sync is true
 */
export function useEvent<T extends AnyFunction>(
  callback: T | undefined,
  opts: UseEventOptions = {},
): T {
  const {sync = false} = opts

  const callbackRef = useLatestRef(callback)

  return useCallback(
    (...args: any[]) => {
      if (sync) {
        return queueMicrotask(() => callbackRef.current?.(...args))
      }
      return callbackRef.current?.(...args)
    },
    [sync, callbackRef],
  ) as T
}

function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
