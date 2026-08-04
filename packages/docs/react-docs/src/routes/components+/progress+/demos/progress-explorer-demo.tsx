import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export function ProgressExplorerDemo(): ReactElement {
  return (
    <Progress
      className="w-64"
      hint="Some contextual help here"
      label="Uploading"
      value={64}
      valueText="64%"
    />
  )
}
