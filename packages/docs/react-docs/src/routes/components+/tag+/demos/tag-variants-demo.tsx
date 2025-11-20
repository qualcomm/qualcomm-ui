import type {ReactElement} from "react"

import {Link2} from "lucide-react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* preview */}
      <Tag endIcon={Link2} variant="link">
        link
      </Tag>
      <Tag variant="selectable">selectable</Tag>
      <Tag variant="dismissable">dismissable</Tag>
      {/* preview */}
    </div>
  )
}
