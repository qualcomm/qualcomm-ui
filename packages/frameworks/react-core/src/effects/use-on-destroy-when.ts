// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useRef} from "react"

interface OnDestroyWhenOptions {
  debugName?: string
}

/**
 * Hook that provides a function to register cleanup callbacks for when
 * a boolean condition becomes true.
 *
 * @param shouldDestroy - Boolean condition that triggers cleanup when true
 * @param opts - Optional configuration including debug name
 * @returns A function to register cleanup callbacks
 */
export function useOnDestroyWhen(
  shouldDestroy: boolean | undefined,
  opts?: OnDestroyWhenOptions,
): (callback: () => void) => void {
  const cleanupCallbacks = useRef<Array<() => void>>([])
  const debugOpts = useRef(opts)

  debugOpts.current = opts

  useEffect(() => {
    if (shouldDestroy) {
      if (debugOpts.current?.debugName) {
        console.debug("onDestroyWhen", debugOpts.current.debugName)
      }

      cleanupCallbacks.current.forEach((callback) => callback())
      cleanupCallbacks.current = []
    }
  }, [shouldDestroy])

  // Also run all cleanup functions when the component unmounts
  useEffect(() => {
    return () => {
      if (debugOpts.current?.debugName) {
        console.debug("onDestroy", debugOpts.current.debugName)
      }
      cleanupCallbacks.current.forEach((callback) => callback())
      cleanupCallbacks.current = [] // Clear the callbacks after executing them
    }
  }, [])

  return (callback: () => void): void => {
    cleanupCallbacks.current.push(callback)
  }
}
