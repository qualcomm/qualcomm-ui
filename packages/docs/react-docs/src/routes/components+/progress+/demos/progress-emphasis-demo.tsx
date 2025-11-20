import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export function ProgressEmphasisDemo(): ReactElement {
  return (
    <div className="flex w-64 flex-col gap-6">
      {/* preview */}
      <Progress emphasis="primary" />
      <Progress emphasis="neutral" />
      {/* preview */}
    </div>
  )
}
