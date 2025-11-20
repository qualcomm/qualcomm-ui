import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export function NumberBadgeSizeDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge size="sm" value={5} />
      <NumberBadge size="md" value={5} />
      <NumberBadge size="lg" value={5} />
      {/* preview */}
    </div>
  )
}
