// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useRef} from "react"

import {useSafeLayoutEffect} from "./use-safe-layout-effect"

interface OnDestroyOptions {
  debugName?: string
}

/**
 * Hook that provides a function to register cleanup callbacks for when
 * the component unmounts.
 *
 * @returns A function to register cleanup callbacks
 */
export function useOnDestroy(
  opts?: OnDestroyOptions,
): (callback: () => void) => void {
  const cleanupCallbacks = useRef<Array<() => void>>([])

  const debugOpts = useRef(opts)
  debugOpts.current = opts

  useSafeLayoutEffect(() => {
    return () => {
      if (debugOpts.current?.debugName) {
        console.debug("onDestroy", debugOpts.current.debugName)
      }
      cleanupCallbacks.current.forEach((callback) => callback())
      cleanupCallbacks.current = []
    }
  }, [])

  return (callback: () => void): void => {
    cleanupCallbacks.current.push(callback)
  }
}
