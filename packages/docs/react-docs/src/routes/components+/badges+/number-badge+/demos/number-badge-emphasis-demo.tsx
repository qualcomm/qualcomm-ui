import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export function NumberBadgeEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge emphasis="neutral" value={5} />
      <NumberBadge emphasis="neutral-outline" value={5} />
      <NumberBadge emphasis="brand" value={5} />
      <NumberBadge emphasis="brand-outline" value={5} />
      <NumberBadge emphasis="info" value={5} />
      <NumberBadge emphasis="success" value={5} />
      <NumberBadge emphasis="warning" value={5} />
      <NumberBadge emphasis="danger" value={5} />
      <NumberBadge emphasis="persistent-black" value={5} />
      <NumberBadge emphasis="persistent-white" value={5} />
      {/* preview */}
    </div>
  )
}
