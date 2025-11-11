// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useRef, useState} from "react"

import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import type {BindableIdCollection, Dict} from "@qualcomm-ui/utils/machine"

export function useBindableIdCollection<T extends Dict>(): BindableIdCollection<
  any,
  any
> {
  const [collection, setCollection] = useState<Record<string, T>>({})
  const isMountedRef = useRef(false)
  const pendingCollectionRef = useRef<Record<string, T>>({})

  useSafeLayoutEffect(() => {
    isMountedRef.current = true
    // sync pending state to actual state if different
    if (
      JSON.stringify(pendingCollectionRef.current) !==
      JSON.stringify(collection)
    ) {
      setCollection(pendingCollectionRef.current)
    }
    return () => {
      isMountedRef.current = false
    }
  }, [collection])

  return {
    get(itemKey: string): T | undefined {
      return pendingCollectionRef.current[itemKey]
    },
    getAll(): Record<string, T> {
      return {...pendingCollectionRef.current}
    },
    keys(): string[] {
      return Object.keys(pendingCollectionRef.current)
    },
    register(
      itemKey: string,
      value: T,
      onDestroy?: (callback: () => void) => void,
    ) {
      if (pendingCollectionRef.current[itemKey] === value) {
        return
      }

      onDestroy?.(() => {
        const {[itemKey]: _removed, ...rest} = pendingCollectionRef.current
        pendingCollectionRef.current = rest
        queueMicrotask(() => {
          if (isMountedRef.current) {
            setCollection(rest)
          }
        })
      })

      pendingCollectionRef.current = {
        ...pendingCollectionRef.current,
        [itemKey]: value,
      }

      queueMicrotask(() => {
        if (isMountedRef.current) {
          setCollection(pendingCollectionRef.current)
        }
      })
    },
    remove(itemKey: string) {
      const {[itemKey]: _removed, ...rest} = pendingCollectionRef.current
      pendingCollectionRef.current = rest
      queueMicrotask(() => {
        if (isMountedRef.current) {
          setCollection(rest)
        }
      })
    },
    set(itemKey: string, value: T) {
      pendingCollectionRef.current = {
        ...pendingCollectionRef.current,
        [itemKey]: value,
      }
      queueMicrotask(() => {
        if (isMountedRef.current) {
          setCollection(pendingCollectionRef.current)
        }
      })
    },
  }
}
