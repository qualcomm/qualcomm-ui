// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useRef, useState} from "react"

import type {BindableId} from "@qualcomm-ui/utils/machine"

interface SetOpts {
  /**
   * If cleaning up the element.
   *
   * @default false
   */
  cleanup?: boolean

  /**
   * Skip the queueMicrotask and set the value immediately.
   *
   * @default false
   */
  immediate?: boolean
}

export function useBindableId(
  valueFromIdsProp?: string,
): BindableId<string | undefined> {
  const [, setValue] = useState<string | undefined>(valueFromIdsProp)

  const isMountedRef = useRef(false)

  const pendingValueRef = useRef<string | undefined>(valueFromIdsProp)

  useEffect(() => {
    isMountedRef.current = true
    setValue(pendingValueRef.current)
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    get: () => pendingValueRef.current,
    set(value: string, opts?: SetOpts) {
      const prevValue = pendingValueRef.current
      pendingValueRef.current = value

      if (opts?.cleanup || opts?.immediate) {
        setValue(value)
      } else {
        queueMicrotask(() => {
          if (isMountedRef.current && prevValue !== value) {
            // trigger re-render
            setValue(valueFromIdsProp || value)
          }
        })
      }
    },
  }
}
