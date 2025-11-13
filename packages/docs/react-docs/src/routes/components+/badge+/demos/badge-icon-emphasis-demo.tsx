import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeIconEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge emphasis="neutral" icon={Star} type="icon" />
      <Badge emphasis="brand" icon={Star} type="icon" />
      <Badge emphasis="info" icon={Star} type="icon" />
      <Badge emphasis="success" icon={Star} type="icon" />
      <Badge emphasis="warning" icon={Star} type="icon" />
      <Badge emphasis="danger" icon={Star} type="icon" />
      {/* preview */}
    </div>
  )
}
