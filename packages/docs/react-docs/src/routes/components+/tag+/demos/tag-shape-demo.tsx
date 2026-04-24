import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagShapeDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {/* preview */}
      <Tag shape="square">Label</Tag>
      <Tag shape="rounded">Label</Tag>
      {/* preview */}
    </div>
  )
}
