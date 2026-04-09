import type {ReactElement} from "react"

import {Smile} from "lucide-react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* preview */}
      <Tag emphasis="outline-brand" startIcon={Smile} variant="selectable">
        outline-brand
      </Tag>
      <Tag emphasis="outline-neutral" startIcon={Smile} variant="selectable">
        outline-neutral
      </Tag>
      <Tag emphasis="neutral" startIcon={Smile} variant="selectable">
        neutral
      </Tag>
      <Tag emphasis="blue" startIcon={Smile} variant="selectable">
        blue
      </Tag>
      <Tag emphasis="cyan" startIcon={Smile} variant="selectable">
        cyan
      </Tag>
      <Tag emphasis="teal" startIcon={Smile} variant="selectable">
        teal
      </Tag>
      <Tag emphasis="lime" startIcon={Smile} variant="selectable">
        lime
      </Tag>
      <Tag emphasis="green" startIcon={Smile} variant="selectable">
        green
      </Tag>
      <Tag emphasis="yellow" startIcon={Smile} variant="selectable">
        yellow
      </Tag>
      <Tag emphasis="amber" startIcon={Smile} variant="selectable">
        amber
      </Tag>
      <Tag emphasis="orange" startIcon={Smile} variant="selectable">
        orange
      </Tag>
      <Tag emphasis="red" startIcon={Smile} variant="selectable">
        red
      </Tag>
      <Tag emphasis="magenta" startIcon={Smile} variant="selectable">
        magenta
      </Tag>
      <Tag emphasis="violet" startIcon={Smile} variant="selectable">
        violet
      </Tag>
      <Tag emphasis="purple" startIcon={Smile} variant="selectable">
        purple
      </Tag>
      {/* preview */}
    </div>
  )
}
