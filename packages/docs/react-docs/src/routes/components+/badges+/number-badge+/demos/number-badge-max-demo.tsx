import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export function NumberBadgeMaxDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge value={99} />
      <NumberBadge value={100} />
      <NumberBadge max={50} value={50} />
      <NumberBadge max={50} value={51} />
      {/* preview */}
    </div>
  )
}
