import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* preview */}
      <Tag size="sm" variant="dismissable">
        Label
      </Tag>
      <Tag size="md" variant="dismissable">
        Label
      </Tag>
      <Tag size="lg" variant="dismissable">
        Label
      </Tag>
      {/* preview */}
    </div>
  )
}
