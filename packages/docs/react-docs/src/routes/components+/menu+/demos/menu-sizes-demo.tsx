import type {ReactElement} from "react"

import {LogOut, Settings, User} from "lucide-react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuSizesDemo(): ReactElement {
  return (
    <Menu.Root size="sm">
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="account">
              <Menu.ItemStartIcon icon={User} />
              Account
            </Menu.Item>
            <Menu.Item value="settings">
              <Menu.ItemStartIcon icon={Settings} />
              Settings
            </Menu.Item>
            <Menu.Item value="logout">
              <Menu.ItemStartIcon icon={LogOut} />
              Logout
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
