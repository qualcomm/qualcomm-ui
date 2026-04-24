import type {ReactNode} from "react"

import {Keybinding, KeybindingIcon} from "@qualcomm-ui/react-vscode/keybinding"

export function KeybindingShowcaseDemo(): ReactNode {
  return (
    <Keybinding>
      <KeybindingIcon>CTRL</KeybindingIcon>
      <KeybindingIcon>K</KeybindingIcon>
    </Keybinding>
  )
}
