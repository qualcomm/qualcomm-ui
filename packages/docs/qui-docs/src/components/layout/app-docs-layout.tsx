import {type ReactNode, type RefObject, useMemo, useState} from "react"

import {
  Link as ReactRouterLink,
  useLocation,
  useSearchParams,
} from "react-router"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Link} from "@qualcomm-ui/react/link"
import {PortalContextProvider} from "@qualcomm-ui/react-core/portal"
import {
  DocsFooter,
  DocsLayout,
  type DocsLayoutSettings,
  MobileSidebar,
} from "@qualcomm-ui/react-mdx/docs-layout"
import {SiteSearch} from "@qualcomm-ui/react-mdx/site-search"

import {DocLink} from "./doc-link"
import {GlobalConfig} from "./global-config"
import {QuiEcosystemMenu} from "./qui-ecosystem-menu"
import {QuiLogo} from "./qui-logo"
import {ThemeToggle} from "./theme-toggle"

interface Props extends Partial<DocsLayoutSettings> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode

  /**
   * Reference to the app's portal container, which sits as a child of the
   * current QDS theme context provider. This is used to render the current QDS
   * theme in demo content that is rendered in a portal, like Dialogs and Drawers.
   */
  portalContainerRef: RefObject<HTMLDivElement | null>
}

export function AppDocsLayout({
  children,
  portalContainerRef,
  ...props
}: Props): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()

  // persist the search input to the URL
  const query = searchParams.get("query") ?? ""

  const [searchInput, setSearchInput] = useState(query)

  const location = useLocation()

  // sync the search input with the url state (used in browser back/forward)
  if (searchInput !== query) {
    setSearchInput(query)
  }

  const portalContext = useMemo(
    () => ({container: portalContainerRef}),
    [portalContainerRef],
  )

  return (
    <DocsLayout
      docProps={{
        changelogUrl: "/changelogs/react",
      }}
      footer={
        <DocsFooter className="flex flex-col items-start justify-center gap-1">
          Copyright © 2026 QUALCOMM incorporated. All rights reserved.{" "}
          <span>
            This site is built with{" "}
            <Link
              href="https://docs.qui.qualcomm.com/"
              size="md"
              target="_blank"
            >
              QUI Docs
            </Link>
            . Head over to the{" "}
            <Link
              href="https://github.qualcomm.com/ProdTools/qui-docs-template"
              size="md"
              target="_blank"
            >
              template repository
            </Link>{" "}
            to start building.
          </span>
        </DocsFooter>
      }
      header={
        <div className="qui-docs__header">
          <HeaderBar.Root className="@container" surface="secondary">
            <HeaderBar.Logo>
              <MobileSidebar>
                <QuiLogo width={20} />
                <HeaderBar.AppTitle>QUI Docs</HeaderBar.AppTitle>
              </MobileSidebar>
              <ReactRouterLink className="flex items-center gap-2" to="/">
                <QuiLogo width={20} />
                <HeaderBar.AppTitle>
                  <span className="whitespace-nowrap">QUI Docs</span>
                </HeaderBar.AppTitle>
              </ReactRouterLink>
              <Link
                className="hidden md:inline-flex"
                render={
                  <ReactRouterLink
                    prefetch="intent"
                    to="/changelogs/react"
                    viewTransition
                  />
                }
                size="xs"
              >
                NEXTGEN
              </Link>
            </HeaderBar.Logo>

            <HeaderBar.Divider />

            <HeaderBar.Nav className="hidden @min-[600px]:flex">
              <QuiEcosystemMenu onOpenChange={setMenuOpen} open={menuOpen} />
            </HeaderBar.Nav>

            <HeaderBar.ActionBar>
              <SiteSearch />
              <GlobalConfig />
              <ThemeToggle />
            </HeaderBar.ActionBar>
          </HeaderBar.Root>
        </div>
      }
      pathname={location.pathname}
      renderLink={DocLink}
      rootBreadcrumb={{
        children: "Home",
        render: <ReactRouterLink to="/" viewTransition />,
      }}
      {...props}
    >
      <PortalContextProvider value={portalContext}>
        {children}
      </PortalContextProvider>
    </DocsLayout>
  )
}
