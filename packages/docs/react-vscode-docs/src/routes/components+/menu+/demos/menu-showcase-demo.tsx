import type {ReactNode} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react-vscode/button"
import {Menu} from "@qualcomm-ui/react-vscode/menu"

export function MenuShowcaseDemo(): ReactNode {
  return (
    <Menu.Root>
      <Menu.Trigger>
        {(bindings) => <Button {...bindings}>View</Button>}
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup id="appearance">
              <Menu.ItemGroupLabel>Appearance</Menu.ItemGroupLabel>
              <Menu.CheckboxItem value="word-wrap">
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>Word Wrap</Menu.ItemLabel>
              </Menu.CheckboxItem>
              <Menu.CheckboxItem value="minimap">
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>Show Minimap</Menu.ItemLabel>
              </Menu.CheckboxItem>
            </Menu.ItemGroup>

            <Menu.Separator />

            <Menu.RadioItemGroup id="theme" value="dark">
              <Menu.ItemGroupLabel>Theme</Menu.ItemGroupLabel>
              <Menu.RadioItem value="light">
                <Menu.RadioItemControl />
                <Menu.ItemLabel>Light</Menu.ItemLabel>
              </Menu.RadioItem>
              <Menu.RadioItem value="dark">
                <Menu.RadioItemControl />
                <Menu.ItemLabel>Dark</Menu.ItemLabel>
              </Menu.RadioItem>
              <Menu.RadioItem value="high-contrast">
                <Menu.RadioItemControl />
                <Menu.ItemLabel>High Contrast</Menu.ItemLabel>
              </Menu.RadioItem>
            </Menu.RadioItemGroup>

            <Menu.Separator />

            <Menu.Item value="settings">
              Preferences: Open User Settings (JSON)
            </Menu.Item>
            <Menu.Item disabled value="redo">
              Redo
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
