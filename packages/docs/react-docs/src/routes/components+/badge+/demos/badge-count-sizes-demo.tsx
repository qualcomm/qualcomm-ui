import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeCountSizesDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge count={5} size="sm" type="count" />
      <Badge count={5} size="md" type="count" />
      <Badge count={5} size="lg" type="count" />
      {/* preview */}
    </div>
  )
}
