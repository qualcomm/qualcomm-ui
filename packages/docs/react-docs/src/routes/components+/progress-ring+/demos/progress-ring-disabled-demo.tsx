import type {ReactElement} from "react"

import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

export function ProgressRingDisabledDemo(): ReactElement {
  return (
    <div className="flex gap-8">
      {/* preview */}
      <ProgressRing disabled label="Indeterminate" size="lg" />
      <ProgressRing
        disabled
        label="Determinate"
        size="lg"
        value={64}
        valueText="64%"
      />
      {/* preview */}
    </div>
  )
}
