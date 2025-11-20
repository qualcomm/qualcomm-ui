import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"

export function SwitchCompositeLayoutDemo(): ReactElement {
  return (
    // preview
    <Switch.Root>
      <Switch.HiddenInput />
      <Switch.Label>Label</Switch.Label>
      <Switch.Control />
    </Switch.Root>
    // preview
  )
}
