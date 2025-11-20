import type {ReactElement} from "react"

import {ChevronLeft, ChevronRight} from "lucide-react"

import {Link} from "@qualcomm-ui/react/link"

export function LinkIconsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <Link endIcon={ChevronRight}>Next Page</Link>
      <Link startIcon={ChevronLeft}>Go Back</Link>
      {/* preview */}
    </div>
  )
}
