import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagEmphasisDemo(): ReactElement {
  return (
    <div className="flex items-center gap-2">
      {/* preview */}
      <Tag emphasis="brand">Label</Tag>
      <Tag emphasis="outline-neutral">Label</Tag>
      <Tag emphasis="neutral">Label</Tag>
      {/* preview */}
    </div>
  )
}
