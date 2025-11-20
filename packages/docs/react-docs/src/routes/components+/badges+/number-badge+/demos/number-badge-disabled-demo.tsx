import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export function NumberBadgeDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge value={5} variant="brand" />
      <NumberBadge disabled value={5} variant="brand" />
      {/* preview */}
    </div>
  )
}
