// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AppContent} from "./app-content.js"
import {DocsBreadcrumbs} from "./breadcrumbs.js"
import {ContentWrapper} from "./content-wrapper.js"
import {DocsFooter} from "./docs-footer.js"
import {MainContent} from "./main-content.js"
import {PageActions} from "./page-actions.js"
import {PageLinks} from "./page-links.js"
import {Root} from "./root.js"
import {Sidebar} from "./sidebar.js"
import {TableOfContents} from "./table-of-contents.js"

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
