import type {ReactElement} from "react"

import {
  Copy,
  Ellipsis,
  File,
  FileText,
  FolderOpen,
  Pencil,
  Trash2,
} from "lucide-react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuButtonDemo(): ReactElement {
  return (
    <div className="flex gap-2.5">
      <Menu.Root positioning={{placement: "bottom-end"}}>
        <Menu.Trigger>
          <Menu.Button emphasis="primary" startIcon={File}>
            File
          </Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-text-file">
                <Menu.ItemStartIcon icon={FileText} />
                New Text File
              </Menu.Item>
              <Menu.Item value="new-file">
                <Menu.ItemStartIcon icon={File} />
                New File...
              </Menu.Item>
              <Menu.Item value="open-file">
                <Menu.ItemStartIcon icon={FolderOpen} />
                Open File...
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Menu.Root>
        <Menu.Trigger>
          <Menu.IconButton
            aria-label="More actions"
            emphasis="primary"
            icon={Ellipsis}
          />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="rename">
                <Menu.ItemStartIcon icon={Pencil} />
                Rename
              </Menu.Item>
              <Menu.Item value="duplicate">
                <Menu.ItemStartIcon icon={Copy} />
                Duplicate
              </Menu.Item>
              <Menu.Item value="delete">
                <Menu.ItemStartIcon icon={Trash2} />
                Delete
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}
