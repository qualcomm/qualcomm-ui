import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {IconBadge} from "@qualcomm-ui/react/badge"

export default function IconBadgeEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <IconBadge emphasis="neutral" icon={Star} />
        <IconBadge emphasis="brand" icon={Star} />
        <IconBadge emphasis="info" icon={Star} />
        <IconBadge emphasis="success" icon={Star} />
        <IconBadge emphasis="warning" icon={Star} />
        <IconBadge emphasis="danger" icon={Star} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <IconBadge emphasis="blue" icon={Star} />
        <IconBadge emphasis="cyan" icon={Star} />
        <IconBadge emphasis="green" icon={Star} />
        <IconBadge emphasis="kiwi" icon={Star} />
        <IconBadge emphasis="magenta" icon={Star} />
        <IconBadge emphasis="orange" icon={Star} />
        <IconBadge emphasis="purple" icon={Star} />
        <IconBadge emphasis="red" icon={Star} />
        <IconBadge emphasis="teal" icon={Star} />
        <IconBadge emphasis="yellow" icon={Star} />
      </div>
    </div>
  )
}
