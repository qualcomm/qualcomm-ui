import {type ReactElement, useState} from "react"

import {Switch} from "@qualcomm-ui/react/switch"

export function SwitchControlledDemo(): ReactElement {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={(nextState) => {
        console.log("Switch state change:", nextState)
        setChecked(nextState)
      }}
    >
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Label</Switch.Label>
    </Switch.Root>
  )
}
