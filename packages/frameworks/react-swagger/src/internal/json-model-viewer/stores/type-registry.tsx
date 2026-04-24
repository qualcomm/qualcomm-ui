// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createContext,
  memo,
  type SetStateAction,
  useContext,
  useMemo,
} from "react"

import {createStore, type StoreApi, useStore} from "zustand"

import {
  arraySchemaType,
  bigIntType,
  booleanSchemaType,
  booleanType,
  dateType,
  floatType,
  functionType,
  intType,
  nanType,
  nullType,
  numberSchemaType,
  objectType,
  stringEnumType,
  stringSchemaType,
  stringType,
  undefinedType,
} from "../components/data-types"
import type {DataItemProps, DataType, Path} from "../type"

function memoizeDataType<Type>(dataType: DataType<Type>): DataType<Type> {
  function compare(
    prevProps: Readonly<DataItemProps<Type>>,
    nextProps: Readonly<DataItemProps<Type>>,
  ) {
    return (
      Object.is(prevProps.value, nextProps.value) &&
      prevProps.inspect &&
      nextProps.inspect &&
      prevProps.path?.join(".") === nextProps.path?.join(".")
    )
  }
  dataType.Component = memo(dataType.Component, compare)
  if (dataType.Editor) {
    dataType.Editor = memo(
      dataType.Editor,
      function compare(prevProps, nextProps) {
        return Object.is(prevProps.value, nextProps.value)
      },
    )
  }
  if (dataType.PreComponent) {
    dataType.PreComponent = memo(dataType.PreComponent, compare)
  }
  if (dataType.PostComponent) {
    dataType.PostComponent = memo(dataType.PostComponent, compare)
  }
  return dataType
}

export const predefinedTypes: DataType<any>[] = [
  memoizeDataType(booleanType),
  memoizeDataType(dateType),
  memoizeDataType(nullType),
  memoizeDataType(undefinedType),
  memoizeDataType(stringType),
  memoizeDataType(functionType),
  memoizeDataType(nanType),
  memoizeDataType(intType),
  memoizeDataType(floatType),
  memoizeDataType(bigIntType),
  memoizeDataType(stringSchemaType),
  memoizeDataType(stringEnumType),
  memoizeDataType(numberSchemaType),
  memoizeDataType(booleanSchemaType),
  memoizeDataType(arraySchemaType),
]

type TypeRegistryState = {
  registerTypes: (setState: SetStateAction<DataType<any>[]>) => void

  registry: DataType<any>[]
}

export const createTypeRegistryStore = () => {
  return createStore<TypeRegistryState>()((set) => ({
    registerTypes: (setState) => {
      set((state) => ({
        registry:
          typeof setState === "function" ? setState(state.registry) : setState,
      }))
    },

    registry: predefinedTypes,
  }))
}

export const TypeRegistryStoreContext = createContext<
  StoreApi<TypeRegistryState>
>(null!)

export const TypeRegistryProvider = TypeRegistryStoreContext.Provider

export const useTypeRegistryStore = <U,>(
  selector: (state: TypeRegistryState) => U,
  equalityFn?: (a: U, b: U) => boolean,
) => {
  const store = useContext(TypeRegistryStoreContext)
  return useStore(store, selector, equalityFn)
}

function matchTypeComponents<Value>(
  value: Value,
  path: Path,
  registry: TypeRegistryState["registry"],
): DataType<Value> {
  let potential: DataType<Value> | undefined
  for (const T of registry) {
    if (T.is(value, path)) {
      potential = T
    }
  }
  if (potential === undefined) {
    if (typeof value === "object") {
      return objectType as unknown as DataType<Value>
    }
    throw new Error(`No type matched for value`, {cause: value})
  }
  return potential
}

export function useTypeComponents(value: unknown, path: Path) {
  const registry = useTypeRegistryStore((store) => store.registry)
  return useMemo(
    () => matchTypeComponents(value, path, registry),
    [value, path, registry],
  )
}
