// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createContext, type Provider, useContext} from "react"

import type {DocPropsLayout} from "./use-props-layout-context"

export interface ColumnNames {
  defaultValue?: string
  /**
   * Only used in list layout
   */
  description: string
  name: string
  type: string
}

export interface TypeDocContextValue {
  columnNames: ColumnNames
  disableRequired: boolean
  hideDefaultColumn?: boolean
  layout: DocPropsLayout
  linkifyPrimaryColumn?: boolean
}

const TypeDocContext = createContext<TypeDocContextValue>(null!)

export const TypeDocContextProvider: Provider<TypeDocContextValue> =
  TypeDocContext.Provider

export function useTypeDocContext(): TypeDocContextValue {
  return useContext(TypeDocContext)
}
