import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"
import {SwitchGroup} from "@qualcomm-ui/react/switch-group"

export function SwitchGroupOrientationDemo(): ReactElement {
  return (
    // preview
    <SwitchGroup label="Notifications" orientation="horizontal">
      <Switch label="Email" />
      <Switch label="SMS" />
      <Switch label="Push" />
    </SwitchGroup>
    // preview
  )
}
