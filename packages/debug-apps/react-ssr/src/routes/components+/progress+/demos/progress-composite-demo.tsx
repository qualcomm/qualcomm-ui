import type {ReactElement} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export default function ProgressCompositeDemo(): ReactElement {
  return (
    // preview
    <Progress.Root className="w-64" value={64}>
      <Progress.Label>Label</Progress.Label>
      <Progress.Context>
        {(api) => (
          <Progress.ValueText>{`${api.valuePercent}%`}</Progress.ValueText>
        )}
      </Progress.Context>
      <Progress.ValueText />
      <Progress.Track />
      <Progress.Hint>Optional hint</Progress.Hint>
    </Progress.Root>
    // preview
  )
}
