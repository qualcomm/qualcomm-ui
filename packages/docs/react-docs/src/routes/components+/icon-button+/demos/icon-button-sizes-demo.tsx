import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonSizesDemo(): ReactElement {
  return (
    <div className="grid justify-items-center gap-4">
      {/* preview */}
      <IconButton
        emphasis="primary"
        icon={ExternalLink}
        size="sm"
        variant="fill"
      />
      <IconButton
        emphasis="primary"
        icon={ExternalLink}
        size="md"
        variant="fill"
      />
      <IconButton
        emphasis="primary"
        icon={ExternalLink}
        size="lg"
        variant="fill"
      />
      {/* preview */}
    </div>
  )
}
