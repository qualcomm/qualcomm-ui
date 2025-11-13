import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeIconSizesDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge icon={Star} size="xxs" type="icon" />
      <Badge icon={Star} size="xs" type="icon" />
      <Badge icon={Star} size="sm" type="icon" />
      <Badge icon={Star} size="md" type="icon" />
      <Badge icon={Star} size="lg" type="icon" />
      <Badge icon={Star} size="xl" type="icon" />
      {/* preview */}
    </div>
  )
}
