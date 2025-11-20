import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export function ProgressLabelOrientationDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Progress
        className="w-96"
        label="Determinate"
        labelOrientation="side"
        value={64}
        valueText="64%"
      />
    </div>
  )
}
