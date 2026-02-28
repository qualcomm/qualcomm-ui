import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"
import {SwitchGroup} from "@qualcomm-ui/react/switch-group"

export function SwitchGroupCompositeDemo(): ReactElement {
  return (
    // preview
    <SwitchGroup.Root>
      <SwitchGroup.Label>Notifications</SwitchGroup.Label>
      <SwitchGroup.Items>
        <Switch label="Email" />
        <Switch label="SMS" />
        <Switch label="Push" />
      </SwitchGroup.Items>
      <SwitchGroup.Hint>Select at least one</SwitchGroup.Hint>
    </SwitchGroup.Root>
    // preview
  )
}
