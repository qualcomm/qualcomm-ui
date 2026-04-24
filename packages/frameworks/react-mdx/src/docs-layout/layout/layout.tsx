// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AppContent} from "./app-content"
import {DocsBreadcrumbs} from "./breadcrumbs"
import {ContentWrapper} from "./content-wrapper"
import {DocsFooter} from "./docs-footer"
import {MainContent} from "./main-content"
import {PageActions} from "./page-actions"
import {PageLinks} from "./page-links"
import {Root} from "./root"
import {Sidebar} from "./sidebar"
import {TableOfContents} from "./table-of-contents"

export const Layout: {
  AppContent: typeof AppContent
  Breadcrumbs: typeof DocsBreadcrumbs
  ContentWrapper: typeof ContentWrapper
  Footer: typeof DocsFooter
  MainContent: typeof MainContent
  PageActions: typeof PageActions
  PageLinks: typeof PageLinks
  Root: typeof Root
  Sidebar: typeof Sidebar
  TableOfContents: typeof TableOfContents
} = {
  AppContent,
  Breadcrumbs: DocsBreadcrumbs,
  ContentWrapper,
  Footer: DocsFooter,
  MainContent,
  PageActions,
  PageLinks,
  Root,
  Sidebar,
  TableOfContents,
}
