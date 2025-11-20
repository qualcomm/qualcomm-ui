import type {ReactElement} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuPlacementDemo(): ReactElement {
  return (
    <Menu.Root positioning={{placement: "right-start"}}>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New Text File</Menu.Item>
            <Menu.Item value="new-file">New File...</Menu.Item>
            <Menu.Item value="new-win">New Window</Menu.Item>
            <Menu.Item value="open-file">Open File...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
