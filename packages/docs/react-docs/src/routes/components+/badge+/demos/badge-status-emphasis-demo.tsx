import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeStatusEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge emphasis="neutral" type="status" />
      <Badge emphasis="brand" type="status" />
      <Badge emphasis="info" type="status" />
      <Badge emphasis="success" type="status" />
      <Badge emphasis="warning" type="status" />
      <Badge emphasis="danger" type="status" />
      {/* preview */}
    </div>
  )
}
