import {type ReactNode, type RefObject, useMemo, useState} from "react"

import {
  Link as ReactRouterLink,
  useLocation,
  useSearchParams,
} from "react-router"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {PortalContextProvider} from "@qualcomm-ui/react-core/portal"
import {
  DocLink,
  Footer,
  GlobalConfig,
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
      footer={<Footer />}
      header={
        <div className="qui-docs__header">
          <HeaderBar.Root>
            <HeaderLogo
              appTitle="QUI Docs"
              changelogHref="https://github.com/qualcomm/qualcomm-ui/tree/main/packages/frameworks/react-mdx/CHANGELOG.md"
            />

            <HeaderBar.Divider />

            <HeaderBar.Nav className="hidden @min-[600px]:flex">
              <QuiEcosystemMenu />
            </HeaderBar.Nav>

            <HeaderBar.ActionBar>
              <SiteSearch />
              <HeaderRepositoryLink />
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
