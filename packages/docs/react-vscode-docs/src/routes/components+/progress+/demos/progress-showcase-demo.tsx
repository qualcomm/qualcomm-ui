import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react-vscode/progress"

export function ProgressShowcaseDemo(): ReactElement {
  return (
    <Progress.Root className="w-[240px]">
      <Progress.Label>Label</Progress.Label>
      <Progress.Track>
        <Progress.Bar />
      </Progress.Track>
    </Progress.Root>
  )
}
