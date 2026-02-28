import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {CheckboxGroup} from "@qualcomm-ui/react/checkbox-group"

export function CheckboxGroupErrorDemo(): ReactElement {
  return (
    // preview
    <CheckboxGroup
      errorText="Select at least one option"
      invalid
      label="Notifications"
    >
      <Checkbox label="Email" />
      <Checkbox label="SMS" />
    </CheckboxGroup>
    // preview
  )
}
