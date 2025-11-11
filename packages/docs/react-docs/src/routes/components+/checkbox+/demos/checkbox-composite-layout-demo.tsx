import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"

export default function CheckboxCompositeLayoutDemo(): ReactElement {
  return (
    // preview
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Label>Label</Checkbox.Label>
      <Checkbox.Control />
    </Checkbox.Root>
    // preview
  )
}
