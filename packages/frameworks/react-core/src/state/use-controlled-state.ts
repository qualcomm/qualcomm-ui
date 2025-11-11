// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import {useCallback, useEffect, useRef, useState} from "react"

interface UseControlledState<T> {
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
  name,
  onChangeProp,
  state = "value",
}: UseControlledState<State>): [State | undefined, SetState] {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const {current: isControlled} = useRef(controlled !== undefined)
  const [valueState, setValue] = useState(defaultProp)
  const value = isControlled ? controlled : valueState

  if (process.env.NODE_ENV !== "production") {
    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `QUI: A component is changing the ${
              isControlled ? "" : "un"
            }controlled ${state} state of ${name} to be ${
              isControlled ? "un" : ""
            }controlled.`,
            "Elements should not switch from uncontrolled to controlled (or vice versa).",
            `Decide between using a controlled or uncontrolled ${name} ` +
              "element for the lifetime of the component.",
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            "More info: https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components",
          ].join("\n"),
        )
      }
    }, [state, name, controlled])
  }

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
