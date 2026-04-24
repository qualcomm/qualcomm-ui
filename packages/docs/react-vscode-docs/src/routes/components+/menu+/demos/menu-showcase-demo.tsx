import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {Menu, MenuContent, MenuItem, MenuTrigger} from "@qualcomm-ui/react-vscode/menu"

export function MenuShowcaseDemo(): ReactNode {
  return (
    <Menu>
      <MenuTrigger>
        {(bindings) => <Button {...bindings}>Command</Button>}
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Preferences: Open User Settings (JSON)</MenuItem>
        <MenuItem disabled>Redo</MenuItem>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </MenuContent>
    </Menu>
  )
}
