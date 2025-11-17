import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export default function NumberBadgeValueDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge>42</NumberBadge>
      <NumberBadge value={5} />
      <NumberBadge value={150} />
      {/* preview */}
    </div>
  )
}
