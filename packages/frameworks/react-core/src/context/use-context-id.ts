// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Dispatch, type SetStateAction, useEffect} from "react"

import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"

/**
 * @param contextId the id from context
 * @param id the id passed to the component as a prop, typically optional.
 * @param setContextId the context id setter.
 * @param defaultValue optional default value for unsetting the field on unmounting.
 */
export interface UseContextIdParams<
  T extends string | undefined = string | undefined,
> {
  /**
   * The id stored in context.
   */
  contextId: T

  /**
   * optional default value for unsetting the field.
   */
  defaultValue?: T

  idProp: string | undefined

  /**
   * The context id setter.
   */
  setContextId: Dispatch<SetStateAction<T>>
}

/**
 * Handles syncing an element's id with its parent context.
 *
 * @returns the controlled id
 */
export function useContextId<
  T extends string | undefined = string | undefined,
>({
  contextId,
  defaultValue,
  idProp,
  setContextId,
}: UseContextIdParams<T>): string {
  const id = useControlledId(idProp)

  useEffect(() => {
    return () => {
      setContextId(defaultValue || (undefined as T))
    }
  }, [setContextId, defaultValue])

  useSafeLayoutEffect(() => {
    if (contextId !== id) {
      setContextId(id as T)
    }
  }, [id, contextId, setContextId])

  return id
}
