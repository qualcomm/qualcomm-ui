import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {IconBadge} from "@qualcomm-ui/react/badge"

export function IconBadgeDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <IconBadge emphasis="brand" icon={Star} />
      <IconBadge disabled emphasis="brand" icon={Star} />
      {/* preview */}
    </div>
  )
}
