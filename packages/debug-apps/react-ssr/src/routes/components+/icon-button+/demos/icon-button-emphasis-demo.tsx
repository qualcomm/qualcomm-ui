import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export default function Demo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div className="text-neutral-primary font-heading-xs">Neutral</div>
      <div className="text-neutral-primary font-heading-xs">Primary</div>
      <div className="text-neutral-primary font-heading-xs">Danger</div>

      {/* preview */}
      <IconButton emphasis="neutral" icon={ExternalLink} variant="fill" />
      <IconButton emphasis="primary" icon={ExternalLink} variant="fill" />
      <IconButton emphasis="danger" icon={ExternalLink} variant="fill" />
      {/* preview */}
    </div>
  )
}
