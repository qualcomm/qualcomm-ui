import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {IconBadge} from "@qualcomm-ui/react/badge"

export default function IconBadgeVariantDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <IconBadge emphasis="neutral" icon={Star} variant="subtle" />
        <IconBadge emphasis="brand" icon={Star} variant="subtle" />
        <IconBadge emphasis="info" icon={Star} variant="subtle" />
        <IconBadge emphasis="success" icon={Star} variant="subtle" />
        <IconBadge emphasis="warning" icon={Star} variant="subtle" />
        <IconBadge emphasis="danger" icon={Star} variant="subtle" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <IconBadge emphasis="cat-1" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-2" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-3" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-4" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-5" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-6" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-7" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-8" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-9" icon={Star} variant="subtle" />
        <IconBadge emphasis="cat-10" icon={Star} variant="subtle" />
      </div>
    </div>
  )
}
