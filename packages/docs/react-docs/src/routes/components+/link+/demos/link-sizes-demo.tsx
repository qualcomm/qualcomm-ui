import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {Link} from "@qualcomm-ui/react/link"

export function LinkSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* preview */}
      <Link endIcon={ExternalLink} size="xs">
        Link
      </Link>
      <Link endIcon={ExternalLink} size="sm">
        Link
      </Link>
      <Link endIcon={ExternalLink} size="md">
        Link
      </Link>
      <Link endIcon={ExternalLink} size="lg">
        Link
      </Link>
      <Link endIcon={ExternalLink} size="xl">
        Link
      </Link>
      <Link endIcon={ExternalLink} size="xxl">
        Link
      </Link>
      {/* preview */}
    </div>
  )
}
