import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {IconBadge} from "@qualcomm-ui/react/badge"

export function IconBadgeVariantDemo(): ReactElement {
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
        <IconBadge emphasis="blue" icon={Star} variant="subtle" />
        <IconBadge emphasis="cyan" icon={Star} variant="subtle" />
        <IconBadge emphasis="green" icon={Star} variant="subtle" />
        <IconBadge emphasis="kiwi" icon={Star} variant="subtle" />
        <IconBadge emphasis="magenta" icon={Star} variant="subtle" />
        <IconBadge emphasis="orange" icon={Star} variant="subtle" />
        <IconBadge emphasis="purple" icon={Star} variant="subtle" />
        <IconBadge emphasis="red" icon={Star} variant="subtle" />
        <IconBadge emphasis="teal" icon={Star} variant="subtle" />
        <IconBadge emphasis="yellow" icon={Star} variant="subtle" />
      </div>
    </div>
  )
}
