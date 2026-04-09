import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonShapeDemo(): ReactElement {
  return (
    <div className="flex gap-2">
      {/* preview */}
      <IconButton aria-label="Navigate" icon={ExternalLink} shape="square" />
      <IconButton aria-label="Navigate" icon={ExternalLink} shape="rounded" />
      {/* preview */}
    </div>
  )
}
