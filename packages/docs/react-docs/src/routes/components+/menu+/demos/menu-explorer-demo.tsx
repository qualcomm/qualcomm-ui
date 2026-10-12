import {type ReactElement, useState} from "react"

import {Command, File, FolderOpen, Pencil} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {Menu} from "@qualcomm-ui/react/menu"

export function MenuExplorerDemo(): ReactElement {
  const [open, setOpen] = useState(true)

  return (
    <Menu.Root
      onOpenChange={setOpen}
      open={open}
      positioning={{placement: "bottom-start"}}
    >
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Actions</Menu.Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Header>
          <Menu.HeaderLabel>Actions</Menu.HeaderLabel>
        </Menu.Header>
        <Menu.Content>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>File</Menu.ItemGroupLabel>
            <Menu.Item value="new">
              <Menu.ItemStartIcon icon={File} />
              <Menu.ItemLabel>New File</Menu.ItemLabel>
              <Menu.ItemCommand>
                <Icon icon={Command} size="xs" />N
              </Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="open">
              <Menu.ItemStartIcon icon={FolderOpen} />
              <Menu.ItemLabel>Open File</Menu.ItemLabel>
              <Menu.ItemCommand>
                <Icon icon={Command} size="xs" />O
              </Menu.ItemCommand>
              <Menu.ItemDescription>Browse local files</Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item value="rename">
              <Menu.ItemStartIcon icon={Pencil} />
              <Menu.ItemLabel>Rename</Menu.ItemLabel>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>Options</Menu.ItemGroupLabel>
            <Menu.CheckboxItem value="autosave">
              <Menu.CheckboxItemControl />
              <Menu.ItemLabel>Autosave</Menu.ItemLabel>
            </Menu.CheckboxItem>
            <Menu.CheckboxItem checked value="minimap">
              <Menu.ItemLabel>Minimap</Menu.ItemLabel>
              <Menu.ItemIndicator />
            </Menu.CheckboxItem>
          </Menu.ItemGroup>
        </Menu.Content>
        <Menu.Footer>
          <Button onClick={() => setOpen(false)} type="button">
            Done
          </Button>
        </Menu.Footer>
      </Menu.Positioner>
    </Menu.Root>
  )
}
