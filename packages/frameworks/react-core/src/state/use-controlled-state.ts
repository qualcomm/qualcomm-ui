// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useRef, useState} from "react"

export interface UseControlledState<T> {
  /**
   * The controlled value.
   */
  controlled: T | undefined

  /**
   * The default value.
   */
  defaultValue: T | undefined

  /**
   * If true, delay the state callback by one tick.
   */
  delayCallback?: boolean

  /**
   * The name of this instance. Used in error logging.
   */
  name: string

  /**
   * The optional onChange callback.
   */
  onChangeProp?: (value: T, ...rest: any[]) => void

  /**
   * The name of the value. Used in error logging.
   */
  state?: string
}

/**
 * Forked from MUI. This hook gives us the ability to control state while also
 * letting the user pass in their own state control props. If the user doesn't pass
 * in a value, the component is uncontrolled. This hook ensures that the state is
 * still tracked when uncontrolled.
 */
export function useControlledState<
  State,
  SetState = (newValue: State, ...extraParams: any[]) => void,
>({
  controlled,
  defaultValue: defaultProp,
  delayCallback,
  onChangeProp,
}: UseControlledState<State>): [State | undefined, SetState] {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const {current: isControlled} = useRef(controlled !== undefined)
  const [valueState, setValue] = useState(defaultProp)
  const value = isControlled ? controlled : valueState

  const setValueIfUncontrolled: SetState = useCallback<any>(
    (newValue: State, ...rest: any[]) => {
      const callback = () => onChangeProp?.(newValue, ...rest)
      if (delayCallback) {
        setTimeout(callback)
      } else {
        callback()
      }
      if (!isControlled) {
        setValue(newValue)
      }
    },
    [],
  )

  return [value, setValueIfUncontrolled]
}
