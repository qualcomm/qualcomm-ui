import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"

export function SwitchStatesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {/* preview */}
      <Switch />
      <Switch defaultChecked />
      {/* preview */}
    </div>
  )
}
