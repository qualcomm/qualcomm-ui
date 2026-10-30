// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createContext,
  type Dispatch,
  type Provider,
  type SetStateAction,
  useContext,
} from "react"

import type {
  KnowledgePageData,
  NavItem,
  PageHeading,
  PageMap,
} from "@qualcomm-ui/mdx-common"
import type {NavDensity} from "@qualcomm-ui/react-mdx/docs-layout"
import type {PropsContextValue} from "@qualcomm-ui/react-mdx/typedoc"

/**
 * @since next-release
 */
export interface DocsPageContextValue {
  hidePageLinks: boolean
  hideSideNav: boolean
  mainContentElement: HTMLElement | null
  navDensity: NavDensity
  navItems: NavItem[]
  pageExport: boolean | KnowledgePageData | undefined
  pageFrontmatter: Record<string, unknown>
  pageMap: PageMap
  pageProps: PropsContextValue | null
  pathname: string
  setMainContentElement: Dispatch<SetStateAction<HTMLElement | null>>
  showToc: boolean
  toc: PageHeading[]
}

const DocsPageContext = createContext<DocsPageContextValue>(null as any)

/**
 * @since next-release
 */
export const DocsPageProvider: Provider<DocsPageContextValue> =
  DocsPageContext.Provider

/**
 * @since next-release
 */
export function useDocsPageContext(): DocsPageContextValue {
  const context = useContext(DocsPageContext)

  if (!context) {
    throw new Error(
      "useDocsPageContext can only be used as children of a <Layout.Root> instance.",
    )
  }

  return context
}
