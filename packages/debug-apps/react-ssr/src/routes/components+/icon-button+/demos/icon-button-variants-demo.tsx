import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export default function Demo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div className="text-neutral-primary font-heading-xs">Fill</div>
      <div className="text-neutral-primary font-heading-xs">Outline</div>
      <div className="text-neutral-primary font-heading-xs">Ghost</div>

      {/* preview */}
      <IconButton icon={ExternalLink} variant="fill" />
      <IconButton icon={ExternalLink} variant="outline" />
      <IconButton icon={ExternalLink} variant="ghost" />
      {/* preview */}
    </div>
  )
}
