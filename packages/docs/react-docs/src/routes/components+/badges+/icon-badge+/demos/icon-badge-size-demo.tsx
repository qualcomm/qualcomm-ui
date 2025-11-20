import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {IconBadge} from "@qualcomm-ui/react/badge"

export function IconBadgeSizeDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <IconBadge icon={Star} size="xxs" />
      <IconBadge icon={Star} size="xs" />
      <IconBadge icon={Star} size="sm" />
      <IconBadge icon={Star} size="md" />
      <IconBadge icon={Star} size="lg" />
      <IconBadge icon={Star} size="xl" />
      {/* preview */}
    </div>
  )
}
