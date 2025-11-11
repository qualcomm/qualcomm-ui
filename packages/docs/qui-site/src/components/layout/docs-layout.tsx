import {ReactNode, useState} from "react"

import {Blocks} from "lucide-react"
import {
  Link as ReactRouterLink,
  useLocation,
  useSearchParams,
} from "react-router"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Icon} from "@qualcomm-ui/react/icon"
import {Link} from "@qualcomm-ui/react/link"
import {
  DocsFooter,
  DocsLayout,
  DocsLayoutSettings,
  MobileSidebar,
} from "@qualcomm-ui/react-mdx/docs-layout"
import {SiteSearch} from "@qualcomm-ui/react-mdx/site-search"

import {DocLink} from "./doc-link"
import {QuiEcosystemMenu} from "./qui-ecosystem-menu"
import {QuiLogo} from "./qui-logo"
import {ThemeToggle} from "./theme-toggle"

interface Props extends Partial<DocsLayoutSettings> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function AppDocsLayout({children, ...props}: Props): ReactNode {
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

  return (
    <DocsLayout
      footer={
        <DocsFooter className="flex flex-col items-start justify-center gap-1">
          Copyright © 2026 QUALCOMM incorporated. All rights reserved.{" "}
        </DocsFooter>
      }
      header={
        <div className="qui-docs__header">
          <HeaderBar.Root className="@container" surface="secondary">
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
              <HeaderBar.NavItem
                active={location.pathname === "/components/all-components"}
                render={
                  <ReactRouterLink
                    to="/components/all-components"
                    viewTransition
                  />
                }
              >
                <Icon icon={Blocks} />
                Components
              </HeaderBar.NavItem>
              <QuiEcosystemMenu onOpenChange={setMenuOpen} open={menuOpen} />
            </HeaderBar.Nav>

            <HeaderBar.ActionBar>
              <SiteSearch />
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
      {children}
    </DocsLayout>
  )
}
