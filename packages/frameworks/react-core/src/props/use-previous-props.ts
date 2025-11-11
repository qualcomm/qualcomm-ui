// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useRef} from "react"

export function usePreviousProps<T>(
  value: T,
  skipInitialRender: boolean = true,
) {
  const ref = useRef<T | NonNullable<unknown>>(skipInitialRender ? value : {})
  useEffect(() => {
    ref.current = value
  })
  return ref.current as Partial<T>
}
