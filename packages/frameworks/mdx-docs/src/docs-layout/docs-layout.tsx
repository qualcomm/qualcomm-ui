// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"

import {Layout} from "./layout"
import type {DocsLayoutSettings} from "./types"

export interface DocsLayoutProps extends DocsLayoutSettings {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode

  /**
   * Props to pass to the sidebar.
   */
  sidebarProps?: ElementRenderProp<"div">
}

export function DocsLayout({
  children,
  footer,
  header,
  rootBreadcrumb,
  sidebarProps,
  ...props
}: DocsLayoutProps): ReactNode {
  return (
    <Layout.Root {...props}>
      {({hidePageLinks, hideSideNav, showToc}) => (
        <>
          {header}

          <Layout.ContentWrapper>
            <Layout.AppContent>
              {!hideSideNav && <Layout.Sidebar {...sidebarProps} />}

              <Layout.MainContent>
                <Layout.Breadcrumbs rootBreadcrumb={rootBreadcrumb} />

                {children}

                {!hidePageLinks && <Layout.PageLinks />}
              </Layout.MainContent>

              {showToc ? <Layout.TableOfContents /> : null}
            </Layout.AppContent>
          </Layout.ContentWrapper>

          {footer}
        </>
      )}
    </Layout.Root>
  )
}
