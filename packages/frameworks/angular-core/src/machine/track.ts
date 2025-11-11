// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {effect, type Injector, runInInjectionContext} from "@angular/core"

import {isEqual} from "@qualcomm-ui/utils/equal"
import {isFunction} from "@qualcomm-ui/utils/guard"

function access<T>(value: T | (() => T)): T {
  return isFunction(value) ? value() : value
}

export function useTrack(
  injector: Injector,
): (deps: any[], _effect: VoidFunction) => void {
  return (deps, _effect) => {
    let prevDeps: any[] = []
    let isInitialized = false
    let isMounted = false

    runInInjectionContext(injector, () => {
      // Separate effect to track mount state
      effect(() => {
        queueMicrotask(() => {
          isMounted = true
        })
      })

      effect(() => {
        const currentDeps = deps.map((d) => access(d))

        if (!isInitialized) {
          prevDeps = currentDeps
          isInitialized = true
          return
        }

        if (!isMounted) {
          return
        }

        let changed = false
        for (let i = 0; i < deps.length; i++) {
          if (!isEqual(prevDeps[i], currentDeps[i])) {
            changed = true
            break
          }
        }

        if (changed) {
          prevDeps = currentDeps
          _effect()
        }
      })
    })
  }
}
