import type {ReactElement} from "react"

import {StatusBadge} from "@qualcomm-ui/react/badge"

export default function StatusBadgeSizeDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <StatusBadge size="xs" />
      <StatusBadge size="sm" />
      <StatusBadge size="md" />
      <StatusBadge size="lg" />
      <StatusBadge size="xl" />
      {/* preview */}
    </div>
  )
}
