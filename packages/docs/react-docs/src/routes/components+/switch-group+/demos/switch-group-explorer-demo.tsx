import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"
import {SwitchGroup} from "@qualcomm-ui/react/switch-group"

export function SwitchGroupExplorerDemo(): ReactElement {
  return (
    <SwitchGroup hint="Select at least one" label="Notifications">
      <Switch label="Email" />
      <Switch label="SMS" />
      <Switch label="Push" />
    </SwitchGroup>
  )
}
