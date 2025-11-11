import type {ReactElement} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export default function MenuRadioGroupDemo(): ReactElement {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button emphasis="primary">Show Menu</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.RadioItemGroup>
              <Menu.ItemGroupLabel>Choose an option</Menu.ItemGroupLabel>
              <Menu.RadioItem value="one">
                <Menu.RadioItemControl />
                <Menu.ItemLabel>Option 1</Menu.ItemLabel>
              </Menu.RadioItem>
              <Menu.RadioItem value="two">
                <Menu.RadioItemControl />
                <Menu.ItemLabel>Option 2</Menu.ItemLabel>
              </Menu.RadioItem>
              <Menu.RadioItem value="three">
                <Menu.RadioItemControl />
                <Menu.ItemLabel>Option 3</Menu.ItemLabel>
              </Menu.RadioItem>
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
