import type {ReactElement} from "react"

import {Plus} from "lucide-react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagIconsDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* preview */}
      <Tag emphasis="neutral" startIcon={Plus}>
        Label
      </Tag>
      <Tag emphasis="neutral" endIcon={Plus}>
        Label
      </Tag>
      {/* preview */}
    </div>
  )
}
