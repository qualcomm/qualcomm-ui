// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo, useState} from "react"

import {
  bindingRenderProp,
  type BindingRenderProp,
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  type MdxDocsContextValue,
  MdxDocsProvider,
  type PackageManager,
  type RouteDemoState,
  useSiteContext,
} from "@qualcomm-ui/react-mdx/context"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {MdxProvider} from "../mdx-provider"
import type {DocsLayoutSettings} from "../types"

import {
  MdxDocsLayoutContextProvider,
  type MdxDocsLayoutContextState,
} from "./use-mdx-docs-layout"

export interface RootProps
  extends Omit<ElementRenderProp<"div">, "children">,
    Omit<DocsLayoutSettings, "rootBreadcrumb" | "header" | "footer"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: BindingRenderProp<MdxDocsLayoutContextState>
}

export function Root({
  children,
  demoState: demoStateProp,
  docProps,
  hideToc,
  mdxComponents,
  onDemoStateChange,
  onPackageManagerChange,
  packageManager: packageManagerProp = "npm",
  pathname,
  renderLink,
  ssrUserAgent,
  tocHighlightStrategy = "nearest",
  ...props
}: RootProps): ReactElement {
  const [mainContentElement, setMainContentElement] =
    useState<HTMLElement | null>(null)
  const [packageManager, setPackageManager] =
    useState<PackageManager>(packageManagerProp)
  const [demoState, setDemoState] = useState<RouteDemoState>(
    demoStateProp || {},
  )

  const {navItems, pageDocProps, pageMap} = useSiteContext()

  const mdxDocsContextValue: MdxDocsContextValue = useMemo(
    () => ({
      demoState,
      docProps,
      packageManager,
      renderLink,
      setPackageManager: (nextState) => {
        setPackageManager(nextState)
        onPackageManagerChange?.(nextState)
      },
      ssrUserAgent,
      tocHighlightStrategy,
      updateDemoState: (routeUrl, demoId, entry) => {
        setDemoState((prevState) => {
          const state = prevState[routeUrl] ?? {}
          const demos = state[demoId] ?? {}
          const nextState = {
            ...prevState,
            [routeUrl]: {
              ...state,
              [demoId]: {
                ...demos,
                ...entry,
              },
            },
          }
          onDemoStateChange?.(nextState)
          return nextState
        })
      },
    }),
    [
      demoState,
      docProps,
      onDemoStateChange,
      onPackageManagerChange,
      packageManager,
      renderLink,
      ssrUserAgent,
      tocHighlightStrategy,
    ],
  )

  const layoutContext: MdxDocsLayoutContextState = useMemo(() => {
    const pageData = pageMap[pathname]
    const toc = pageData?.toc ?? []
    const showToc = !!toc.length && !pageData?.hideToc && !hideToc
    const hidePageLinks = pageData?.hidePageLinks || false
    const hideSideNav = pageData?.hideSideNav || false

    const pageProps = pageDocProps?.[pathname] || {}

    return {
      hidePageLinks,
      hideSideNav,
      mainContentElement,
      navItems,
      pageMap,
      pageProps,
      pathname,
      setMainContentElement,
      showToc,
      toc,
    }
  }, [hideToc, mainContentElement, navItems, pageDocProps, pageMap, pathname])

  const mergedProps = mergeProps({className: "qui-docs__root"}, props)

  return (
    <MdxDocsProvider value={mdxDocsContextValue}>
      <MdxProvider components={mdxComponents} pathname={pathname}>
        <MdxDocsLayoutContextProvider value={layoutContext}>
          <PolymorphicElement as="div" {...mergedProps}>
            {bindingRenderProp(children, layoutContext, {
              forwardPropsToClone: false,
            })}
          </PolymorphicElement>
        </MdxDocsLayoutContextProvider>
      </MdxProvider>
    </MdxDocsProvider>
  )
}
