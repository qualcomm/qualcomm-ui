import type {ReactElement} from "react"

import {NumberBadge} from "@qualcomm-ui/react/badge"

export function NumberBadgeVariantDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <NumberBadge value={5} variant="neutral" />
      <NumberBadge value={5} variant="neutral-outline" />
      <NumberBadge value={5} variant="brand" />
      <NumberBadge value={5} variant="brand-outline" />
      <NumberBadge value={5} variant="info" />
      <NumberBadge value={5} variant="success" />
      <NumberBadge value={5} variant="warning" />
      <NumberBadge value={5} variant="danger" />
      <NumberBadge value={5} variant="persistent-black" />
      <NumberBadge value={5} variant="persistent-white" />
      {/* preview */}
    </div>
  )
}
