import {type ReactNode, useState} from "react"

import {Blocks} from "lucide-react"
import {
  Link as ReactRouterLink,
  useLocation,
  useSearchParams,
} from "react-router"

import {
  DocLink,
  Footer,
  GlobalConfig,
  HeaderAiLink,
  HeaderLogo,
  HeaderRepositoryLink,
  PageHeaderBadges,
  QuiEcosystemMenu,
  SideNavBadges,
  ThemeToggle,
} from "@qualcomm-ui/react-internal/layout"
import type {LayoutComponents} from "@qualcomm-ui/react-mdx/context"
import {
  DocsLayout,
  type DocsLayoutSettings,
} from "@qualcomm-ui/react-mdx/docs-layout"
import {SiteSearch} from "@qualcomm-ui/react-mdx/site-search"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"

import angularPkg from "../../../../../frameworks/angular/package.json"

import {DemoUpdateContextProvider} from "./demo-update-context"
import {ResetDemoDimensionsButton} from "./reset-demo-dimensions-button"
import {useAngularDemoReloader} from "./use-angular-demo-reloader"
import {useRouterLinkInterceptor} from "./use-router-link-interceptor"
import {useThemeSwitchInterceptor} from "./use-theme-switch-interceptor"

const layoutComponents: LayoutComponents = {
  PageHeaderBadges,
  SideNavBadges,
}

interface Props extends Partial<DocsLayoutSettings> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function AppDocsLayout({children, ...props}: Props): ReactNode {
  const [searchParams] = useSearchParams()
  const demoUpdateContext = useAngularDemoReloader()

  useThemeSwitchInterceptor()
  useRouterLinkInterceptor()

  // persist the search input to the URL
  const query = searchParams.get("query") ?? ""

  const [searchInput, setSearchInput] = useState(query)

  const location = useLocation()

  // sync the search input with the url state (used in browser back/forward)
  if (searchInput !== query) {
    setSearchInput(query)
  }

  return (
    <DocsLayout
      footer={<Footer />}
      header={
        <div className="qui-docs__header">
          <HeaderBar.Root>
            <HeaderLogo
              appTitle="QUI Angular"
              changelogHref="https://github.com/qualcomm/qualcomm-ui/tree/main/packages/frameworks/angular/CHANGELOG.md"
              changelogText={`NextGen v${angularPkg.version}`}
            />

            <HeaderBar.Divider />

            <HeaderBar.Nav className="hidden @min-[600px]:flex">
              <HeaderBar.NavItem
                active={location.pathname === "/components/overview"}
                render={
                  <ReactRouterLink to="/components/overview" viewTransition />
                }
                startIcon={Blocks}
              >
                Components
              </HeaderBar.NavItem>
              <QuiEcosystemMenu />
            </HeaderBar.Nav>

            <HeaderBar.ActionBar>
              <SiteSearch />
              <ResetDemoDimensionsButton />
              <HeaderRepositoryLink />
              <GlobalConfig />
              <HeaderAiLink />
              <ThemeToggle />
            </HeaderBar.ActionBar>
          </HeaderBar.Root>
        </div>
      }
      layoutComponents={layoutComponents}
      pathname={location.pathname}
      renderLink={DocLink}
      rootBreadcrumb={{
        children: "Home",
        render: <ReactRouterLink to="/" viewTransition />,
      }}
      {...props}
    >
      <DemoUpdateContextProvider value={demoUpdateContext}>
        {children}
      </DemoUpdateContextProvider>
    </DocsLayout>
  )
}
