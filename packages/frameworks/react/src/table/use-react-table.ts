// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useRef, useState} from "react"

import {
  createTable,
  type RowData,
  type TableInstance,
  type TableOptions,
  type TableOptionsResolved,
} from "@qualcomm-ui/core/table"

export function useReactTable<TData extends RowData>(
  options: TableOptions<TData>,
): TableInstance<TData> {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptionsResolved<TData> = {
    // Dummy state
    onStateChange: () => {},
    // noop
    renderFallbackValue: null,
    state: {},
    ...options,
  }

  // Create a new table and store it in state
  const [tableRef] = useState(() => ({
    current: createTable<TData>(resolvedOptions),
  }))

  // By default, manage table state here using the table's initial state
  const [state, setState] = useState(() => tableRef.current.initialState)

  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  tableRef.current.setOptions((prev) => ({
    ...prev,
    ...options,
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: (updater) => {
      if (!mountedRef.current) {
        return
      }
      setState(updater)
      options.onStateChange?.(updater)
    },

    state: {
      ...state,
      ...options.state,
    },
  }))

  return tableRef.current
}
