import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react-vscode/progress"

export function ProgressLayoutDemo(): ReactElement {
  return (
    // preview
    <Progress.Root className="w-60" defaultValue={50}>
      <div className="flex gap-4">
        <Progress.Label>Label</Progress.Label>
        <Progress.Track>
          <Progress.Bar />
        </Progress.Track>
        <Progress.ValueText>50%</Progress.ValueText>
      </div>
    </Progress.Root>
    // preview
  )
}
