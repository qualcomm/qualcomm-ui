import type {ReactNode} from "react"

import {ExternalLink} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"

export default function IconSizesDemo(): ReactNode {
  return (
    <div className="q-foreground-1-primary grid justify-center gap-4">
      <div className="flex items-end justify-center gap-4">
        <Icon icon={ExternalLink} size="xs" />
        <Icon icon={ExternalLink} size="sm" />
        <Icon icon={ExternalLink} size="md" />
        <Icon icon={ExternalLink} size="lg" />
        <Icon icon={ExternalLink} size="xl" />
      </div>
      <div className="flex items-center justify-center gap-4">
        <Icon icon={ExternalLink} size={32} />
        <Icon icon={ExternalLink} size={42} />
      </div>
    </div>
  )
}
