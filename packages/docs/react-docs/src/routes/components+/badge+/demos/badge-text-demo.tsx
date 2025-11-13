import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeTextDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge>New</Badge>
      <Badge>Pro</Badge>
      <Badge>Beta</Badge>
      {/* preview */}
    </div>
  )
}
