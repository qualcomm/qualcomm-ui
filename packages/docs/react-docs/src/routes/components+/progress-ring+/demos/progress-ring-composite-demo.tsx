import type {ReactElement} from "react"

import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

export function ProgressRingCompositeDemo(): ReactElement {
  return (
    <ProgressRing.Root size="lg">
      <ProgressRing.CircleContainer>
        <ProgressRing.Circle>
          <ProgressRing.Track />
          <ProgressRing.Bar />
        </ProgressRing.Circle>
      </ProgressRing.CircleContainer>

      <ProgressRing.Label>Loading...</ProgressRing.Label>
    </ProgressRing.Root>
  )
}
