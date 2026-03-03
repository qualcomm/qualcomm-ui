import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {CheckboxGroup} from "@qualcomm-ui/react/checkbox-group"

export function CheckboxGroupSimpleDemo(): ReactElement {
  return (
    // preview
    <CheckboxGroup hint="Select at least one" label="Notifications">
      <Checkbox label="Email" />
      <Checkbox label="SMS" />
      <Checkbox label="Push" />
    </CheckboxGroup>
    // preview
  )
}
