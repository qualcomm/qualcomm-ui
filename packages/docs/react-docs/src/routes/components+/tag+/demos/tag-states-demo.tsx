import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagStatesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {/* preview */}
      <Tag variant="dismissable">Label</Tag>
      <Tag disabled variant="dismissable">
        Label
      </Tag>
      {/* preview */}
    </div>
  )
}
