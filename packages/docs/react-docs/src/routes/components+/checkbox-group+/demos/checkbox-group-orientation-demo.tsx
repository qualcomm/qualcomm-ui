import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {CheckboxGroup} from "@qualcomm-ui/react/checkbox-group"

export function CheckboxGroupOrientationDemo(): ReactElement {
  return (
    // preview
    <CheckboxGroup label="Notifications" orientation="horizontal">
      <Checkbox label="Email" />
      <Checkbox label="SMS" />
      <Checkbox label="Push" />
    </CheckboxGroup>
    // preview
  )
}
