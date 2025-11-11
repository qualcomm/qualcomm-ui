import type {ReactNode} from "react"

import {ExternalLink, Eye, Search} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"

export default function IconShowcaseDemo(): ReactNode {
  return (
    <div className="grid justify-center">
      <div className="q-foreground-1-primary flex gap-4">
        {/* preview */}
        <Icon icon={ExternalLink} size="lg" />
        <Icon icon={Search} size="lg" />
        <Icon icon={Eye} size="lg" />
        {/* preview */}
      </div>
    </div>
  )
}
