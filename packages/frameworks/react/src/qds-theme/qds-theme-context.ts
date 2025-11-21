// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Dispatch, SetStateAction} from "react"

import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export type QdsBrand = "qualcomm" | "snapdragon" | "dragonwing"

export type ColorScheme = "light" | "dark"

export interface QdsThemeContextValue {
  brand: QdsBrand | null
  setBrand: Dispatch<SetStateAction<QdsBrand | null>>
}

/**
 * @deprecated migrate to {@link isQdsBrand}
 */
export function isQdsTheme(value: unknown): value is QdsBrand {
  return isQdsBrand(value)
}

export function isQdsBrand(value: unknown): value is QdsBrand {
  return (
    typeof value === "string" &&
    (value === "qualcomm" || value === "snapdragon" || value === "dragonwing")
  )
}

export const [QdsThemeContextProvider, useQdsThemeContext] =
  createGuardedContext<QdsThemeContextValue>({
    hookName: "useQdsThemeContext",
    providerName: "<QdsThemeContextProvider>",
    strict: false,
  })
