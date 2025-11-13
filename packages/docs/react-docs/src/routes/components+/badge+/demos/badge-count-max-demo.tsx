import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeCountMaxDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge count={99} type="count" />
      <Badge count={100} type="count" />
      <Badge count={50} max={50} type="count" />
      <Badge count={51} max={50} type="count" />
      {/* preview */}
    </div>
  )
}
