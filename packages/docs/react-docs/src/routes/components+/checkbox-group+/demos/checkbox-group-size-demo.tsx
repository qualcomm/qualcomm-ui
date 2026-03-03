import type {ReactElement} from "react"

import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {CheckboxGroup} from "@qualcomm-ui/react/checkbox-group"

export function CheckboxGroupSizeDemo(): ReactElement {
  return (
    <div className="flex flex-row gap-8">
      <CheckboxGroup label="Small" size="sm">
        <Checkbox label="Email" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
      <CheckboxGroup label="Medium" size="md">
        <Checkbox label="Email" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
      <CheckboxGroup label="Large" size="lg">
        <Checkbox label="Email" />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    </div>
  )
}
