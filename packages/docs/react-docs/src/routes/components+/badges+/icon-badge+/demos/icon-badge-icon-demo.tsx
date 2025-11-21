import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {IconBadge} from "@qualcomm-ui/react/badge"

export function IconBadgeIconDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <IconBadge icon={Star} />
      <IconBadge>
        <svg fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </IconBadge>
      {/* preview */}
    </div>
  )
}
