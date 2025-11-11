// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createContext, type Provider, useContext} from "react"

export type DocPropsLayout = "table" | "list"

export interface PropsLayoutState {
  propsLayout: DocPropsLayout
  setPropsLayout: (value: DocPropsLayout) => void
}

const PropsLayoutContext = createContext<PropsLayoutState | null>(null)

export const PropsLayoutProvider: Provider<PropsLayoutState | null> =
  PropsLayoutContext.Provider

const defaultState: PropsLayoutState = {
  propsLayout: "table",
  setPropsLayout: (_value: DocPropsLayout) => {
    // no-op
  },
}

interface UsePropsLayoutContextProps {
  /**
   * If `true`, throw an error if the Provider is not found.
   */
  strict?: boolean
}

export function usePropsLayoutContext({
  strict,
}: UsePropsLayoutContextProps = {}): PropsLayoutState {
  const context = useContext(PropsLayoutContext)

  if (!context && strict) {
    throw new Error(
      "PropsLayout components must be wrapped in a <PropsLayoutProvider>",
    )
  }

  return context ?? defaultState
}
