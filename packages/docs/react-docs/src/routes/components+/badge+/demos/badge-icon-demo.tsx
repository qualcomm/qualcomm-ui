import type {ReactElement} from "react"

import {Star} from "lucide-react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeIconDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge icon={Star} type="icon" />
      <Badge type="icon">
        <svg fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </Badge>
      {/* preview */}
    </div>
  )
}
