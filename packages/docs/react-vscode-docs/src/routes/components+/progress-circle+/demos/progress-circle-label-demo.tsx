import type {ReactElement} from "react"

import {ProgressCircle} from "@qualcomm-ui/react-vscode/progress-circle"

export function ProgressCircleLabelDemo(): ReactElement {
  return (
    <ProgressCircle.Root defaultValue={50} size="lg">
      <ProgressCircle.Label>50%</ProgressCircle.Label>
      <ProgressCircle.Circle />
    </ProgressCircle.Root>
  )
}
