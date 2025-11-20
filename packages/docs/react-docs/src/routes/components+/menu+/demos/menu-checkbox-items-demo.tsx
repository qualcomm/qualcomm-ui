import type {ReactElement} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function MenuCheckboxItemsDemo(): ReactElement {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {/* preview */}
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Choose an option</Menu.ItemGroupLabel>
              <Menu.CheckboxItem value="item-1-1">
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>Option 1</Menu.ItemLabel>
              </Menu.CheckboxItem>
              <Menu.CheckboxItem value="item-1-2">
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>Option 2</Menu.ItemLabel>
              </Menu.CheckboxItem>
            </Menu.ItemGroup>

            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Choose an option</Menu.ItemGroupLabel>
              <Menu.CheckboxItem value="item-2-1">
                <Menu.ItemLabel>Option 1</Menu.ItemLabel>
                <Menu.ItemIndicator />
              </Menu.CheckboxItem>
              <Menu.CheckboxItem value="item-2-2">
                <Menu.ItemLabel>Option 2</Menu.ItemLabel>
                <Menu.ItemIndicator />
              </Menu.CheckboxItem>
            </Menu.ItemGroup>
            {/* preview */}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
