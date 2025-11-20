import type {ReactElement} from "react"

import {StatusBadge} from "@qualcomm-ui/react/badge"

export function StatusBadgeDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <StatusBadge emphasis="brand" />
      <StatusBadge disabled emphasis="brand" />
      {/* preview */}
    </div>
  )
}
