import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export function NumberBadgeDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge emphasis="brand" value={5} />
      <NumberBadge disabled emphasis="brand" value={5} />
      {/* preview */}
    </div>
  )
}
