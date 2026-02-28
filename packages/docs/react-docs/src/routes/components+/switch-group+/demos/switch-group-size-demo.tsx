import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"
import {SwitchGroup} from "@qualcomm-ui/react/switch-group"

export function SwitchGroupSizeDemo(): ReactElement {
  return (
    <div className="flex flex-row gap-8">
      <SwitchGroup label="Small" size="sm">
        <Switch label="Email" />
        <Switch label="SMS" />
      </SwitchGroup>
      <SwitchGroup label="Medium" size="md">
        <Switch label="Email" />
        <Switch label="SMS" />
      </SwitchGroup>
      <SwitchGroup label="Large" size="lg">
        <Switch label="Email" />
        <Switch label="SMS" />
      </SwitchGroup>
    </div>
  )
}
