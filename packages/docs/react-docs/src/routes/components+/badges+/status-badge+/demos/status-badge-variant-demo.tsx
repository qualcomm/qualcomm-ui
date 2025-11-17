import type {ReactElement} from "react"

import {StatusBadge} from "@qualcomm-ui/react/badge"

export default function StatusBadgeVariantDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <StatusBadge emphasis="neutral" variant="outlined" />
      <StatusBadge emphasis="brand" variant="outlined" />
      <StatusBadge emphasis="info" variant="outlined" />
      <StatusBadge emphasis="success" variant="outlined" />
      <StatusBadge emphasis="warning" variant="outlined" />
      <StatusBadge emphasis="danger" variant="outlined" />
      {/* preview */}
    </div>
  )
}
