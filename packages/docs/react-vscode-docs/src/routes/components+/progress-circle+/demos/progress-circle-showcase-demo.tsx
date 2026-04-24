import type {ReactElement} from "react"

import {ProgressCircle} from "@qualcomm-ui/react-vscode/progress-circle"

export function ProgressCircleShowcaseDemo(): ReactElement {
  return (
    <ProgressCircle.Root>
      <ProgressCircle.Circle />
    </ProgressCircle.Root>
  )
}
