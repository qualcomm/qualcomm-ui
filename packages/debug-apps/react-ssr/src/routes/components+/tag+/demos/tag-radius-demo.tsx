import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"

export default function TagRadiusDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {/* preview */}
      <Tag radius="square">Label</Tag>
      <Tag radius="rounded">Label</Tag>
      {/* preview */}
    </div>
  )
}
