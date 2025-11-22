import {type ReactNode, useEffect, useMemo, useRef, useState} from "react"

import {
  Link as ReactRouterLink,
  useLocation,
  useSearchParams,
} from "react-router"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Link} from "@qualcomm-ui/react/link"
import {
  DocLink,
  Footer,
  GlobalConfig,
  GlobalConfigContextProvider,
  type GlobalConfigContextValue,
  HeaderAiLink,
  HeaderLogo,
  HeaderRepositoryLink,
  QuiEcosystemMenu,
  ThemeToggle,
} from "@qualcomm-ui/react-internal/layout"
import {
  DocsLayout,
  type DocsLayoutSettings,
} from "@qualcomm-ui/react-mdx/docs-layout"
import {SiteSearch} from "@qualcomm-ui/react-mdx/site-search"
import {updateSiteState} from "@qualcomm-ui/react-router-utils/client"

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
        footer={<Footer />}
        header={
          <div className="qui-docs__header">
            <HeaderBar.Root surface="secondary">
              <HeaderLogo
                appTitle="QUI React Table"
                changelogHref="https://github.com/qualcomm/qualcomm-ui/tree/main/packages/frameworks/react/CHANGELOG.md"
              />

              <HeaderBar.Divider />

              <HeaderBar.Nav className="hidden @min-[600px]:flex">
                <QuiEcosystemMenu />
              </HeaderBar.Nav>

              <HeaderBar.ActionBar>
                <SiteSearch />
                <HeaderRepositoryLink />
                <GlobalConfig />
                <HeaderAiLink modelId="cs45-qui-react-nextgen" />
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
