import type {ReactElement} from "react"

import {Layers2, Moon, Settings} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Icon} from "@qualcomm-ui/react/icon"

export function HeaderBarExplorerDemo(): ReactElement {
  return (
    <HeaderBar.Root>
      <HeaderBar.Logo>
        <Icon icon={Layers2} size="lg" />
        <HeaderBar.AppTitle>App Name</HeaderBar.AppTitle>
      </HeaderBar.Logo>
      <HeaderBar.Divider />
      <HeaderBar.Nav>
        <HeaderBar.NavItem>Home</HeaderBar.NavItem>
        <HeaderBar.NavItem>Settings</HeaderBar.NavItem>
      </HeaderBar.Nav>
      <HeaderBar.ActionBar>
        <HeaderBar.ActionIconButton icon={Moon} />
        <HeaderBar.ActionIconButton icon={Settings} />
      </HeaderBar.ActionBar>
    </HeaderBar.Root>
  )
}
