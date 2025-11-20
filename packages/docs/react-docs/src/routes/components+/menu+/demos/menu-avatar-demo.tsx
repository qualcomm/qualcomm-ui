import type {ReactElement} from "react"

import {LogOut, Settings, User} from "lucide-react"

import {Avatar} from "@qualcomm-ui/react/avatar"
import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuAvatarDemo(): ReactElement {
  return (
    <Menu.Root positioning={{placement: "right-start"}}>
      <Menu.Trigger>
        <Avatar.Root render={<button />} status="active">
          <Avatar.Image alt="John Doe" src="/images/avatar-man.png" />
          <Avatar.Content>JD</Avatar.Content>
          <Avatar.Status />
        </Avatar.Root>
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
