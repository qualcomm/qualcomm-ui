import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export default function Demo(): ReactElement {
  return (
    <div className="grid justify-items-center gap-4">
      {/* preview */}
      <IconButton
        density="compact"
        emphasis="primary"
        icon={ExternalLink}
        size="sm"
        variant="fill"
      />
      <IconButton
        density="compact"
        emphasis="primary"
        icon={ExternalLink}
        size="md"
        variant="fill"
      />
      <IconButton
        density="compact"
        emphasis="primary"
        icon={ExternalLink}
        size="lg"
        variant="fill"
      />
      {/* preview */}
    </div>
  )
}
