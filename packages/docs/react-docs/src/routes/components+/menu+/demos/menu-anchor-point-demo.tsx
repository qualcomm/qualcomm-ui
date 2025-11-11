import {type ReactElement, useRef} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export default function MenuAnchorPointDemo(): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null)
  const getAnchorRect = () => ref.current!.getBoundingClientRect()

  return (
    <Menu.Root positioning={{getAnchorRect}}>
      <div className="flex flex-col gap-4">
        <Menu.Trigger>
          <Menu.Button emphasis="primary">Show Menu</Menu.Button>
        </Menu.Trigger>
        <div
          ref={ref}
          className="font-body-lg text-neutral-primary bg-neutral-04 border-neutral-01 rounded-md border p-4"
        >
          Anchor
        </div>
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
