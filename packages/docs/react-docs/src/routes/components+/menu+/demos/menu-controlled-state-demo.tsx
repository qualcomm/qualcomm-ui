import {type ReactElement, useState} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuControlledStateDemo(): ReactElement {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Menu.Root onOpenChange={(nextState) => setOpen(nextState)} open={open}>
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
