import {type ReactElement, useState} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"

export default function CheckboxControlledDemo(): ReactElement {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(nextState) => {
        console.log("checkbox state change:", nextState)
        setChecked(nextState)
      }}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>Label</Checkbox.Label>
    </Checkbox.Root>
  )
}
