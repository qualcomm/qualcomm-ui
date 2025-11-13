import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge emphasis="brand">Enabled</Badge>
      <Badge emphasis="brand" disabled>
        Disabled
      </Badge>
      {/* preview */}
    </div>
  )
}
