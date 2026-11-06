// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo, useState} from "react"

import type {NavItem, PageMap} from "@qualcomm-ui/mdx-common"
import {
  bindingRenderProp,
  type BindingRenderProp,
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  type DemoSettings,
  type DocsRuntimeContextValue,
  DocsRuntimeProvider,
  type PackageManager,
  type RouteDemoState,
  useDocsManifestContext,
  DocsPageProvider,
  type DocsPageContextValue,
  type NavSwitcherState,
} from "@qualcomm-ui/react-mdx/context"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {MdxProvider} from "../mdx-provider.js"
import type {DocsLayoutSettings} from "../types.js"

export interface RootProps
  extends
    Omit<ElementRenderProp<"div">, "children">,
    Omit<DocsLayoutSettings, "rootBreadcrumb" | "header" | "footer"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: BindingRenderProp<DocsPageContextValue>
}

export function Root({
  children,
  demoSettings: demoSettingsProp,
  demoState: demoStateProp,
  docProps,
  docsNavLabel = "Documentation",
  hideToc,
  layoutComponents,
  mdxComponents,
  navDensity = "compact",
  onDemoSettingsChange,
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
  const [demoSettings, setDemoSettings] = useState<DemoSettings>(
    demoSettingsProp || {transformTailwindClasses: false},
  )

  const {exports, navItems, openApiNav, pageDocProps, pageMap} =
    useDocsManifestContext()

  // The longest match wins when one API's intro page is nested under another's.
  const openApiPathname = Object.keys(openApiNav ?? {})
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0]

  const [lastDocsPathname, setLastDocsPathname] = useState<string | null>(null)
  if (!openApiPathname && lastDocsPathname !== pathname) {
    setLastDocsPathname(pathname)
  }

  const mdxDocsContextValue: DocsRuntimeContextValue = useMemo(
    () => ({
      demoSettings,
      demoState,
      docProps,
      layoutComponents,
      packageManager,
      renderLink,
      setDemoSettings: (updaterOrValue) => {
        const nextState =
          typeof updaterOrValue === "function"
            ? updaterOrValue(demoSettings)
            : updaterOrValue
        setDemoSettings(nextState)
        onDemoSettingsChange?.(nextState)
      },
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
      demoSettings,
      demoState,
      docProps,
      onDemoSettingsChange,
      layoutComponents,
      onDemoStateChange,
      onPackageManagerChange,
      packageManager,
      renderLink,
      ssrUserAgent,
      tocHighlightStrategy,
    ],
  )

  const layoutContext: DocsPageContextValue = useMemo(() => {
    const pageData = pageMap[pathname]
    const toc = pageData?.toc ?? []
    const showToc = !!toc.length && !pageData?.hideToc && !hideToc
    const hidePageLinks = pageData?.hidePageLinks || false
    const hideSideNav = pageData?.hideSideNav || false
    const pageExport =
      !!exports?.enabled && !!exports.pathnames?.includes(pathname)

    const pageProps = pageDocProps?.[pathname] || {}

    return {
      fullWidth: !!openApiPathname,
      hidePageLinks,
      hideSideNav,
      mainContentElement,
      navDensity,
      navItems: openApiPathname ? openApiNav![openApiPathname] : navItems,
      navSwitcher: getNavSwitcher({
        docsNavLabel,
        docsPathname: lastDocsPathname ?? getFirstPathname(navItems) ?? "/",
        openApiPathname,
        openApiPathnames: Object.keys(openApiNav ?? {}),
        pageMap,
      }),
      pageExport,
      pageFrontmatter: pageData?.data ?? {},
      pageMap,
      pageProps,
      pathname,
      setMainContentElement,
      showToc,
      toc,
    }
  }, [
    docsNavLabel,
    exports,
    hideToc,
    lastDocsPathname,
    navDensity,
    mainContentElement,
    navItems,
    openApiNav,
    openApiPathname,
    pageDocProps,
    pageMap,
    pathname,
  ])

  const mergedProps = mergeProps(
    {
      className: "qui-docs__root",
      "data-nav-density": navDensity,
      "data-pathname": pathname,
    },
    props,
  )

  return (
    <DocsRuntimeProvider value={mdxDocsContextValue}>
      <MdxProvider components={mdxComponents} pathname={pathname}>
        <DocsPageProvider value={layoutContext}>
          <PolymorphicElement as="div" {...mergedProps}>
            {bindingRenderProp(children, layoutContext, {
              forwardPropsToClone: false,
            })}
          </PolymorphicElement>
        </DocsPageProvider>
      </MdxProvider>
    </DocsRuntimeProvider>
  )
}

function getFirstPathname(items: NavItem[]): string | undefined {
  for (const item of items) {
    const pathname = item.pathname ?? getFirstPathname(item.items ?? [])
    if (pathname) {
      return pathname
    }
  }
  return undefined
}

interface NavSwitcherOptions {
  docsNavLabel: string
  docsPathname: string
  openApiPathname: string | undefined
  openApiPathnames: string[]
  pageMap: PageMap
}

/**
 * Hidden APIs stay out of the switcher, except while one is being viewed so
 * that the trigger still names it.
 */
function getNavSwitcher({
  docsNavLabel,
  docsPathname,
  openApiPathname,
  openApiPathnames,
  pageMap,
}: NavSwitcherOptions): NavSwitcherState | null {
  const apiEntries = openApiPathnames
    .filter(
      (pathname) => pathname === openApiPathname || !pageMap[pathname]?.hidden,
    )
    .map((pathname) => ({
      label: pageMap[pathname]?.title || pathname,
      pathname,
    }))
  if (!apiEntries.length) {
    return null
  }
  const docsEntry = {label: docsNavLabel, pathname: docsPathname}
  return {
    active:
      apiEntries.find((entry) => entry.pathname === openApiPathname) ??
      docsEntry,
    entries: [docsEntry, ...apiEntries],
  }
}
