import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuWithinDialogDemo(): ReactElement {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          Show Dialog
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className="w-72">
            <Dialog.Body>
              <Dialog.Heading>Dialog Title</Dialog.Heading>
              <Dialog.CloseButton />

              <Menu.Root>
                <Menu.Trigger>
                  <Menu.Button className="place-self-start" emphasis="primary">
                    Show Menu
                  </Menu.Button>
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="new-txt">New Text File</Menu.Item>
                    <Menu.Item value="new-file">New File...</Menu.Item>
                    <Menu.Item value="new-win">New Window</Menu.Item>
                    <Menu.Item value="open-file">Open File...</Menu.Item>
                    <Menu.Item value="export">Export</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
