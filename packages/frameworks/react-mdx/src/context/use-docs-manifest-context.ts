// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createContext, type Provider, useContext} from "react"

import type {KnowledgePages, SiteData} from "@qualcomm-ui/mdx-common"

/**
 * @since 3.1.0
 */
export interface DocsManifestContextValue extends SiteData {
  getPages?: () => Promise<KnowledgePages | null>
}

const DocsManifestContext = createContext<DocsManifestContextValue | null>(null)

/**
 * @since 3.1.0
 */
export const DocsManifestProvider: Provider<DocsManifestContextValue | null> =
  DocsManifestContext.Provider

const siteDataFallback: SiteData = {navItems: [], pageMap: {}, searchIndex: []}

/**
 * @since 3.1.0
 */
export function useDocsManifestContext(): DocsManifestContextValue {
  const context = useContext(DocsManifestContext)

  if (!context) {
    console.warn(
      "`useDocsManifestContext` can only be used in a child of <DocsManifestProvider>",
    )
    return siteDataFallback
  }

  return context
}
