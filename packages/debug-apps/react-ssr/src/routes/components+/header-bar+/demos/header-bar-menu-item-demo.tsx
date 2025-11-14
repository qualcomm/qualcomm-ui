import {AArrowDownIcon, Layers2} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Icon} from "@qualcomm-ui/react/icon"
import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

export default function Demo() {
  return (
    <HeaderBar.Root>
      <HeaderBar.Logo>
        <div className="bg-category-1-subtle rounded-sm p-0.5">
          <Icon icon={Layers2} size="lg" />
        </div>
        <HeaderBar.AppTitle>Qualcomm AI Visualizer</HeaderBar.AppTitle>
      </HeaderBar.Logo>

      <HeaderBar.Divider />

      <HeaderBar.Nav>
        <HeaderBar.NavItem>Home</HeaderBar.NavItem>

        <Menu.Root>
          <Menu.Trigger>
            <HeaderBar.MenuItem>Menu Item</HeaderBar.MenuItem>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {["Menu Item 1", "Menu Item 2", "Menu Item 3"].map((entry) => (
                  <Menu.Item key={entry} value={entry}>
                    <Menu.ItemStartIcon icon={AArrowDownIcon} />
                    <Menu.ItemLabel>{entry}</Menu.ItemLabel>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HeaderBar.Nav>
    </HeaderBar.Root>
  )
}
