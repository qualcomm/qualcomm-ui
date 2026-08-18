import {useCallback, useState} from "react"

import {functionalUpdate, type OnChangeFn} from "@qualcomm-ui/core/table"

export function useControlledState<T>(
  initialState: T,
  onChange?: (state: T) => void,
): [T, OnChangeFn<T>] {
  const [state, setState] = useState(initialState)

  const update = useCallback<OnChangeFn<T>>(
    (updater) => {
      setState((previousState) => {
        const nextState = functionalUpdate(updater, previousState)
        onChange?.(nextState)
        return nextState
      })
    },
    [onChange],
  )

  return [state, update]
}
