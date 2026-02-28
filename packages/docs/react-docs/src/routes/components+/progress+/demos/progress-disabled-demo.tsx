import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export function ProgressDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <Progress className="w-64" disabled label="Indeterminate" />
      <Progress
        className="w-64"
        disabled
        label="Determinate"
        value={64}
        valueText="64%"
      />
      {/* preview */}
    </div>
  )
}
