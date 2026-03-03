import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {CheckboxGroup} from "@qualcomm-ui/react/checkbox-group"

export function CheckboxGroupCompositeDemo(): ReactElement {
  return (
    // preview
    <CheckboxGroup.Root>
      <CheckboxGroup.Label>Notifications</CheckboxGroup.Label>
      <CheckboxGroup.Items>
        <Checkbox label="Email" />
        <Checkbox label="SMS" />
        <Checkbox label="Push" />
      </CheckboxGroup.Items>
      <CheckboxGroup.Hint>Select at least one</CheckboxGroup.Hint>
    </CheckboxGroup.Root>
    // preview
  )
}
