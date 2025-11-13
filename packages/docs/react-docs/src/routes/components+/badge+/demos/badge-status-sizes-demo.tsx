import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeStatusSizesDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge size="xs" type="status" />
      <Badge size="sm" type="status" />
      <Badge size="md" type="status" />
      <Badge size="lg" type="status" />
      <Badge size="xl" type="status" />
      {/* preview */}
    </div>
  )
}
