import type {ReactElement} from "react"

import {Command, File, FileText, FolderOpen, ImageDown} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"
import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuItemCustomizationDemo(): ReactElement {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-text-file">
              <Menu.ItemStartIcon icon={FileText} />
              New Text File
              <Menu.ItemCommand>
                <Icon icon={Command} size="xs" />E
              </Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="new-file">
              <Menu.ItemStartIcon icon={File} />
              New File...
              <Menu.ItemCommand>
                <Icon icon={Command} size="xs" />N
              </Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="open-file">
              <Menu.ItemStartIcon icon={FolderOpen} />
              Open File...
              <Menu.ItemCommand>
                <Icon icon={Command} size="xs" />O
              </Menu.ItemCommand>
              <Menu.ItemDescription>Optional Description</Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item value="export">
              <Menu.ItemStartIcon icon={ImageDown} />
              Export
              <Menu.ItemCommand>
                <Icon icon={Command} size="xs" />S
              </Menu.ItemCommand>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
