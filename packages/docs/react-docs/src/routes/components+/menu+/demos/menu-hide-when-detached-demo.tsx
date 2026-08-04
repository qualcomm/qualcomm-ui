import type {ReactElement} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Menu} from "@qualcomm-ui/react/menu"

export function MenuHideWhenDetachedDemo(): ReactElement {
  return (
    <Menu.Root open positioning={{hideWhenDetached: true}}>
      <div className="border-neutral-03 box-border flex max-w-72 gap-2 overflow-x-scroll rounded-md border p-4">
        {[...Array(6).keys()].map((x) => (
          <div
            key={x}
            className="font-body-md text-neutral-primary border-neutral-01 bg-neutral-04 rounded-md border p-3 whitespace-nowrap"
          >
            Item {x}
          </div>
        ))}
        <Menu.Trigger>
          <Menu.Button className="whitespace-nowrap" emphasis="primary">
            Show Menu
          </Menu.Button>
        </Menu.Trigger>
      </div>

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
