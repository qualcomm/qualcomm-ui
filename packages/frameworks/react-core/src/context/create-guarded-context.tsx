// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Context,
  createContext as createReactContext,
  type Provider,
  use,
} from "react"

export interface CreateContextOptions<T> {
  defaultValue?: T
  errorMessage?: string
  hookName?: string
  name?: string
  providerName?: string
  strict?: boolean
}

export type CreateContextReturn<T> = [
  Provider<T>,
  (requireContext?: boolean) => T,
  Context<T>,
]

function getErrorMessage(hook: string, provider: string) {
  return `${hook} returned \`undefined\`. It seems you forgot to wrap this component with ${provider}`
}

/**
 * Helper utility for creating context and a guarded hook for consuming it.
 */
export function createGuardedContext<T>(options: CreateContextOptions<T> = {}) {
  const {
    defaultValue,
    errorMessage,
    hookName = "useContext",
    name,
    providerName = "Provider",
    strict = true,
  } = options

  const Context = createReactContext<T | undefined>(defaultValue)

  Context.displayName = name

  function useContext(requireContext = strict) {
    const context = use(Context)

    if (requireContext && !context) {
      const error = new Error(
        errorMessage ?? getErrorMessage(hookName, providerName),
      )
      error.name = "ContextError"
      Error.captureStackTrace?.(error, useContext)
      throw error
    }

    return context
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<T>
}
