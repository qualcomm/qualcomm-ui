// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createContext, type Provider, useContext} from "react"

import type {SiteData} from "@qualcomm-ui/mdx-docs-common"

const SiteContext = createContext<SiteData | null>(null)

export const SiteContextProvider: Provider<SiteData | null> =
  SiteContext.Provider

const siteDataFallback: SiteData = {navItems: [], pageMap: {}, searchIndex: []}

export function useSiteContext(): SiteData {
  const context = useContext(SiteContext)

  if (!context) {
    console.warn(
      "`useSiteContext` can only be used in a child of <SiteContextProvider>",
    )
    return siteDataFallback
  }

  return context
}
