// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Provider, type RefCallback, useRef, useState} from "react"

import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import {
  type DescendantOptions,
  DescendantsManager,
} from "@qualcomm-ui/utils/descendants"
import {cast} from "@qualcomm-ui/utils/functions"

export type UseDescendantsReturn<
  T extends HTMLElement = HTMLElement,
  K extends Record<string, any> = object,
> = DescendantsManager<T, K>

/**
 * @internal
 * React hook that initializes the DescendantsManager
 */
function useDescendants<
  T extends HTMLElement = HTMLElement,
  K extends Record<string, any> = object,
>(): UseDescendantsReturn<T, K> {
  const descendants = useRef(new DescendantsManager<T, K>())
  useSafeLayoutEffect(() => {
    return () => descendants.current.destroy()
  })
  return descendants.current
}

const [DescendantsContextProvider, useDescendantsContext] =
  createGuardedContext<UseDescendantsReturn>({
    errorMessage:
      "useDescendantsContext must be used within DescendantsProvider",
    name: "DescendantsProvider",
  })

/**
 * @internal
 * This hook provides information a descendant such as:
 * - Its index compared to other descendants
 * - ref callback to register the descendant
 * - Its enabled index compared to other enabled descendants
 */
function useDescendant<
  T extends HTMLElement = HTMLElement,
  K extends Record<string, any> = object,
>(options?: DescendantOptions<K>) {
  const descendants = useDescendantsContext(options?.requireContext)
  const [index, setIndex] = useState(-1)
  const ref = useRef<T>(null)

  const onUnregisterRef = useRef(options?.onUnregister)

  useSafeLayoutEffect(() => {
    return () => {
      if (!ref.current) {
        return
      }
      const dataIndex = Number(ref.current.dataset["index"])
      if (!Number.isNaN(dataIndex)) {
        onUnregisterRef.current?.(dataIndex)
      }
      descendants.unregister(ref.current)
    }
  }, [])

  useSafeLayoutEffect(() => {
    if (!ref.current) {
      return
    }
    const dataIndex = Number(ref.current.dataset["index"])
    if (index !== dataIndex && !Number.isNaN(dataIndex)) {
      setIndex(dataIndex)
    }
  })

  const refCallback = options
    ? cast<RefCallback<T>>(descendants?.register(options))
    : cast<RefCallback<T>>(descendants?.register)

  const mergedRefs = useMergedRef(refCallback, ref)

  return {
    descendants,
    enabledIndex: descendants?.enabledIndexOf(ref.current),
    index,
    register: mergedRefs,
  }
}

export function createDescendantContext<
  T extends HTMLElement = HTMLElement,
  K extends Record<string, any> = object,
>() {
  type ContextProviderType = Provider<DescendantsManager<T, K>>
  const ContextProvider = cast<ContextProviderType>(DescendantsContextProvider)

  const _useDescendantsContext = () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cast<DescendantsManager<T, K>>(useDescendantsContext())

  const _useDescendant = (options?: DescendantOptions<K>) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDescendant<T, K>(options)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const _useDescendants = () => useDescendants<T, K>()

  return [
    // context provider
    ContextProvider,
    // call this when you need to read from context
    _useDescendantsContext,
    // descendants state information, to be called and passed to `ContextProvider`
    _useDescendants,
    // descendant index information
    _useDescendant,
  ] as const
}
