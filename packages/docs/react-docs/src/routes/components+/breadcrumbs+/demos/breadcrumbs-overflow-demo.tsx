import type {ReactElement} from "react"

import {Home} from "lucide-react"
import {Link} from "react-router"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"
import {Menu} from "@qualcomm-ui/react/menu"

export function BreadcrumbsOverflowDemo(): ReactElement {
  return (
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Item icon={Home} render={<Link to="/" />}>
          Home
        </Breadcrumbs.Item>
        {/* preview */}
        <Breadcrumbs.OverflowItem>
          <Menu.Item render={<Link to="/settings" />} value="settings">
            Settings
          </Menu.Item>
          <Menu.Item render={<Link to="/settings/account" />} value="account">
            Account
          </Menu.Item>
        </Breadcrumbs.OverflowItem>
        {/* preview */}
        <Breadcrumbs.Item render={<Link to="/settings/account/security" />}>
          Security
        </Breadcrumbs.Item>
        <Breadcrumbs.Item aria-current="page">Sessions</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  )
}
