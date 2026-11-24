import type {ReactNode} from "react"

import {Blocks} from "lucide-react"
import {Link as ReactRouterLink, useLocation} from "react-router"

import {
  DocLink,
  Footer,
  HeaderLogo,
  HeaderRepositoryLink,
  PageHeaderBadges,
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

const layoutComponents: LayoutComponents = {PageHeaderBadges, SideNavBadges}

interface Props extends Partial<DocsLayoutSettings> {
  /**
   * Documentation content rendered within the shared QUI Docs layout.
   */
  children: ReactNode
}

export function MdxLayout({children, ...props}: Props): ReactNode {
  const {pathname} = useLocation()

  return (
    <DocsLayout
      footer={<Footer />}
      header={
        <div className="qui-docs__header">
          <HeaderBar.Root>
            <HeaderLogo
              appTitle="QUI React VS Code"
              changelogHref="https://github.com/qualcomm/qualcomm-ui/tree/main/packages/frameworks/react-vscode"
              changelogText="NextGen preview"
            />
            <HeaderBar.Divider />
            <HeaderBar.Nav className="hidden @min-[600px]:flex">
              <HeaderBar.NavItem
                active={pathname.startsWith("/components/")}
                render={
                  <ReactRouterLink to="/components/overview" viewTransition />
                }
                startIcon={Blocks}
              >
                Components
              </HeaderBar.NavItem>
            </HeaderBar.Nav>
            <HeaderBar.ActionBar>
              <SiteSearch />
              <HeaderRepositoryLink />
              <ThemeToggle />
            </HeaderBar.ActionBar>
          </HeaderBar.Root>
        </div>
      }
      layoutComponents={layoutComponents}
      pathname={pathname}
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
