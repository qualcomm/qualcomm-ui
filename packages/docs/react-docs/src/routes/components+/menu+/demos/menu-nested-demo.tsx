import type {ReactElement} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export default function MenuNestedDemo(): ReactElement {
  return (
    // preview
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New Text File</Menu.Item>
            <Menu.Item value="new-file">New File...</Menu.Item>
            <Menu.Root positioning={{gutter: 2, placement: "right-start"}}>
              <Menu.TriggerItem value="open-recent">
                Open Recent
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="file-1">File 1</Menu.Item>
                    <Menu.Item value="file-2">File 2</Menu.Item>
                    <Menu.Item value="file-3">File 3</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
    // preview
  )
}
