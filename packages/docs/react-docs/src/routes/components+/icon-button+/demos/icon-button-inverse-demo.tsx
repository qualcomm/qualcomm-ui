import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonInverseDemo(): ReactElement {
  return (
    <div className="bg-neutral-10 flex gap-8 rounded-md p-3">
      {/* preview */}
      <IconButton
        aria-label="Navigate"
        emphasis="inverse"
        icon={ExternalLink}
        variant="fill"
      />
      <IconButton
        aria-label="Navigate"
        emphasis="inverse"
        icon={ExternalLink}
        variant="outline"
      />
      <IconButton
        aria-label="Navigate"
        emphasis="inverse"
        icon={ExternalLink}
        variant="ghost"
      />
      {/* preview */}
    </div>
  )
}
