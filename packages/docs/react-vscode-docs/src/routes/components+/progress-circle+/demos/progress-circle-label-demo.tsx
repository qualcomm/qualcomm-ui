import type {ReactElement} from "react"

import {ProgressCircle} from "@qualcomm-ui/react-vscode/progress-circle"

export function ProgressCircleLabelDemo(): ReactElement {
  return (
    // preview
    <ProgressCircle defaultValue={50} label="50%" size="lg" />
    // preview
  )
}
