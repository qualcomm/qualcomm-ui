import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"

export default function SwitchSizesDemo(): ReactElement {
  return (
    <div className="grid justify-center gap-4">
      {/* preview */}
      <Switch label="Small (sm)" size="sm" />
      <Switch label="Medium (md)" size="md" /> {/* default */}
      {/* preview */}
    </div>
  )
}
