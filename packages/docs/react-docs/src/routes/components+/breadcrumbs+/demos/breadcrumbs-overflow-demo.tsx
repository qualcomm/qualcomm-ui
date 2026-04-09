import type {ReactElement} from "react"

import {Home} from "lucide-react"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"
import {Menu} from "@qualcomm-ui/react/menu"

export function BreadcrumbsOverflowDemo(): ReactElement {
  return (
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="/" icon={Home}>
          Home
        </Breadcrumbs.Item>
        {/* preview */}
        <Breadcrumbs.OverflowItem>
          <Menu.Item render={<a href="/settings" />} value="settings">
            Settings
          </Menu.Item>
          <Menu.Item render={<a href="/settings/account" />} value="account">
            Account
          </Menu.Item>
        </Breadcrumbs.OverflowItem>
        {/* preview */}
        <Breadcrumbs.Item href="/settings/account/security">
          Security
        </Breadcrumbs.Item>
        <Breadcrumbs.Item aria-current="page">Sessions</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  )
}
