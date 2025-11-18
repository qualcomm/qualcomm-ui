import {type ReactNode, useEffect, useMemo, useRef, useState} from "react"

import {
  Link as ReactRouterLink,
  useLocation,
  useSearchParams,
} from "react-router"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Link} from "@qualcomm-ui/react/link"
import {
  DocsFooter,
  DocsLayout,
  type DocsLayoutSettings,
  MobileSidebar,
} from "@qualcomm-ui/react-mdx/docs-layout"
import {Github} from "@qualcomm-ui/react-mdx/icons"
import {SiteSearch} from "@qualcomm-ui/react-mdx/site-search"
import {updateSiteState} from "@qualcomm-ui/react-router-utils/client"

import {DocLink} from "./doc-link"
import {GithubChangelogLink} from "./github-changelog-link"
import {GlobalConfig} from "./global-config"
import {
  GlobalConfigContextProvider,
  type GlobalConfigContextValue,
} from "./global-config-context"
import {QuiEcosystemMenu} from "./qui-ecosystem-menu"
import {QuiLogo} from "./qui-logo"
import {ThemeToggle} from "./theme-toggle"

interface Props extends Partial<DocsLayoutSettings> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode

  /**
   * Whether to hide the demo brand switcher. Persisted through SSR.
   */
  hideDemoBrandSwitcher: boolean

  /**
   * The persisted sidebar scroll position to restore after reload, only applies in
   * dev mode.
   */
  sidebarScrollTop?: number
}

export function AppDocsLayout({
  children,
  hideDemoBrandSwitcher: hideDemoBrandSwitcherProp,
  sidebarScrollTop,
  ...props
}: Props): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const [hideDemoBrandSwitcher, setHideDemoBrandSwitcher] = useState<boolean>(
    hideDemoBrandSwitcherProp,
  )
  const sidebarRef = useRef<HTMLDivElement>(null)

  // persist the search input to the URL
  const query = searchParams.get("query") ?? ""

  const [searchInput, setSearchInput] = useState(query)

  const location = useLocation()

  // sync the search input with the url state (used in browser back/forward)
  if (searchInput !== query) {
    setSearchInput(query)
  }

  const globalConfigContext = useMemo<GlobalConfigContextValue>(() => {
    return {
      hideDemoBrandSwitcher,
      setHideDemoBrandSwitcher: (value) => {
        void updateSiteState("/action/set-site-state", {
          hideDemoBrandSwitcher: value,
        })
        return setHideDemoBrandSwitcher(value)
      },
    }
  }, [hideDemoBrandSwitcher])

  useEffect(() => {
    function beforeUnload() {
      if (import.meta.env.DEV) {
        fetch("/action/set-site-state", {
          body: JSON.stringify({
            sidebarScrollTop: sidebarRef.current?.scrollTop,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
      }
    }
    window.addEventListener("beforeunload", beforeUnload)
    return () => {
      window.removeEventListener("beforeunload", beforeUnload)
    }
  }, [hideDemoBrandSwitcher])

  useEffect(() => {
    if (import.meta.env.DEV && sidebarScrollTop) {
      setTimeout(() => {
        sidebarRef.current?.scrollTo(0, sidebarScrollTop)
      }, 100)
      fetch("/action/set-site-state", {
        body: JSON.stringify({
          sidebarScrollTop: undefined,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    }
  }, [sidebarScrollTop])

  return (
    <GlobalConfigContextProvider value={globalConfigContext}>
      <DocsLayout
        docProps={{
          changelogUrl: "/changelogs/react",
        }}
        footer={
          <DocsFooter className="flex flex-col items-start justify-center gap-1">
            Copyright © 2026 QUALCOMM incorporated. All rights reserved.{" "}
            <span>
              This site is built with{" "}
              <Link href="https://docs.qui.qualcomm.com/" target="_blank">
                QUI Docs
              </Link>
              . Head over to the{" "}
              <Link
                href="https://github.com/qualcomm/qualcomm-ui-templates/tree/main/templates/qui-docs-template"
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
            <HeaderBar.Root surface="secondary">
              <HeaderBar.Logo>
                <MobileSidebar>
                  <QuiLogo width={20} />
                  <HeaderBar.AppTitle>QUI React</HeaderBar.AppTitle>
                </MobileSidebar>
                <ReactRouterLink className="flex items-center gap-2" to="/">
                  <QuiLogo width={20} />
                  <HeaderBar.AppTitle>
                    <span className="whitespace-nowrap">QUI React</span>
                  </HeaderBar.AppTitle>
                </ReactRouterLink>
                <GithubChangelogLink />
              </HeaderBar.Logo>

              <HeaderBar.Divider />

              <HeaderBar.Nav className="hidden @min-[600px]:flex">
                <QuiEcosystemMenu onOpenChange={setMenuOpen} open={menuOpen} />
              </HeaderBar.Nav>

              <HeaderBar.ActionBar>
                <SiteSearch />
                <HeaderBar.ActionIconButton
                  aria-label="Navigate to the Github repository"
                  icon={Github}
                  render={
                    <a
                      href="https://github.com/qualcomm/qualcomm-ui"
                      rel="noreferrer"
                      target="_blank"
                    />
                  }
                />
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
          render: <Link render={<ReactRouterLink to="/" viewTransition />} />,
        }}
        sidebarProps={{ref: sidebarRef}}
        {...props}
      >
        {children}
      </DocsLayout>
    </GlobalConfigContextProvider>
  )
}
