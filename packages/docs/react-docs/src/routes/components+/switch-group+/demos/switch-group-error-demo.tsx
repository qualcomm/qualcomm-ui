import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"
import {SwitchGroup} from "@qualcomm-ui/react/switch-group"

export function SwitchGroupErrorDemo(): ReactElement {
  return (
    // preview
    <SwitchGroup
      errorText="Select at least one option"
      invalid
      label="Notifications"
    >
      <Switch label="Email" />
      <Switch label="SMS" />
    </SwitchGroup>
    // preview
  )
}
