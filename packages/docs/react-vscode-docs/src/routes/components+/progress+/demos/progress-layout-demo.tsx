import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react-vscode/progress"

export function ProgressLayoutDemo(): ReactElement {
  return (
    <Progress.Root className="w-[240px]" defaultValue={50}>
      <div className="flex gap-4">
        <Progress.Label>Label</Progress.Label>
        <Progress.Track>
          <Progress.Bar />
        </Progress.Track>
        <Progress.ValueText>50%</Progress.ValueText>
      </div>
    </Progress.Root>
  )
}
