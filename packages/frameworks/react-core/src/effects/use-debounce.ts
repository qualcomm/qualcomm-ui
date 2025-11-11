// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useState} from "react"

/**
 * A hook that returns a value parameter once every X milliseconds, where X is the
 * configured delay. When the timer reaches the configured delay, the value is
 * updated and returned. If the parameter is updated, the timer resets and starts
 * again from 0.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
