import type {ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useProgressRingContext} from "@qualcomm-ui/react-core/progress-ring"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface ProgressCircleContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<ProgressApi>
}

export function ProgressCircleContext({
  children,
}: ProgressCircleContextProps): ReactNode {
  const context = useProgressRingContext()
  return renderProp(children, context)
}
