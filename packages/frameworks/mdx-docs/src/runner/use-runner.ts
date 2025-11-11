// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createElement,
  type ReactElement,
  useMemo,
  useRef,
  useState,
} from "react"

import {Runner} from "./runner"
import type {RunnerOptions} from "./types"

export interface UseRunnerProps extends RunnerOptions {
  disableCache?: boolean
  onRendered?: (error: Error | undefined) => void
}

export interface UseRunnerReturn {
  element: ReactElement | null
  error: string | null
}

export function useRunner({
  code,
  disableCache,
  onRendered,
  scope,
}: UseRunnerProps): UseRunnerReturn {
  const cachedElementRef = useRef<ReactElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const element = useMemo(() => {
    return createElement(Runner, {
      code,
      onRendered: (error) => {
        onRendered?.(error)
        if (error) {
          setError(error.toString())
        } else {
          cachedElementRef.current = element
          setError(null)
        }
      },
      scope,
    })
  }, [code, onRendered, scope])

  return {
    element: error && !disableCache ? cachedElementRef.current : element,
    error,
  }
}
