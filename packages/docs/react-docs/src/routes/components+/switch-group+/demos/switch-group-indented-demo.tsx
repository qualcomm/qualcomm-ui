import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"
import {SwitchGroup} from "@qualcomm-ui/react/switch-group"

export function SwitchGroupIndentedDemo(): ReactElement {
  return (
    // preview
    <SwitchGroup indented label="Notifications">
      <Switch label="Email" />
      <Switch label="SMS" />
      <Switch label="Push" />
    </SwitchGroup>
    // preview
  )
}
