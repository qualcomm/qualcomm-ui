import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeStatusVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge emphasis="neutral" type="status" variant="outlined" />
      <Badge emphasis="brand" type="status" variant="outlined" />
      <Badge emphasis="info" type="status" variant="outlined" />
      <Badge emphasis="success" type="status" variant="outlined" />
      <Badge emphasis="warning" type="status" variant="outlined" />
      <Badge emphasis="danger" type="status" variant="outlined" />
      {/* preview */}
    </div>
  )
}
