import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeCountDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge type="count">42</Badge>
      <Badge count={5} type="count" />
      <Badge count={150} type="count" />
      {/* preview */}
    </div>
  )
}
