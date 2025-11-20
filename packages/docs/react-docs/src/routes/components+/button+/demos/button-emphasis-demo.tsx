import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

export function ButtonEmphasisDemo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div className="text-neutral-primary font-heading-xs">Neutral</div>
      <div className="text-neutral-primary font-heading-xs">Primary</div>
      <div className="text-neutral-primary font-heading-xs">Danger</div>

      {/* preview */}
      <Button emphasis="neutral" startIcon={ExternalLink} variant="fill">
        Action
      </Button>
      <Button emphasis="primary" startIcon={ExternalLink} variant="fill">
        Action
      </Button>
      <Button emphasis="danger" startIcon={ExternalLink} variant="fill">
        Action
      </Button>
      {/* preview */}
    </div>
  )
}
