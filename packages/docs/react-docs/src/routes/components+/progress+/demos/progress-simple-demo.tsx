import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export function ProgressSimpleDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <Progress className="w-64" label="Indeterminate" />
      <Progress
        hint="Optional hint"
        label="Determinate"
        value={64}
        valueText="64%"
      />
      {/* preview */}
    </div>
  )
}
