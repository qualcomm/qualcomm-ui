import type {ReactElement} from "react"

import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

export function ProgressRingExplorerDemo(): ReactElement {
  return (
    <ProgressRing
      label="Uploading"
      size="lg"
      value={64}
      valueText={(api) => `${api.valuePercent}%`}
    />
  )
}
