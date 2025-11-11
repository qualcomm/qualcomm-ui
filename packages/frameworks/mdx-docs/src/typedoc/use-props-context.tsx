// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createContext, type Provider, useContext} from "react"

import type {PageDocProps} from "@qualcomm-ui/mdx-docs-common"

export type PropsContextValue = PageDocProps

const PropsContext = createContext<PropsContextValue | null>(null)

export const PropsContextProvider: Provider<PageDocProps | null> =
  PropsContext.Provider

export function usePropsContext(): PropsContextValue {
  const context = useContext(PropsContext)

  if (!context) {
    throw new Error(
      "Error, expected a <PropsContextProvider> somewhere in the component tree.",
    )
  }

  return context
}
