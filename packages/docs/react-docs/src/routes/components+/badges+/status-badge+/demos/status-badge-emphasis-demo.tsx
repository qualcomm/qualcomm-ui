import type {ReactElement} from "react"

import {StatusBadge} from "@qualcomm-ui/react/badge"

export default function StatusBadgeEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <StatusBadge emphasis="neutral" />
      <StatusBadge emphasis="brand" />
      <StatusBadge emphasis="info" />
      <StatusBadge emphasis="success" />
      <StatusBadge emphasis="warning" />
      <StatusBadge emphasis="danger" />
      {/* preview */}
    </div>
  )
}
