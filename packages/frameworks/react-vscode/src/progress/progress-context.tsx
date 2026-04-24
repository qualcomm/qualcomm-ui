import type {ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useProgressContext} from "@qualcomm-ui/react-core/progress"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface ProgressContextProps {
  children: RenderProp<ProgressApi>
}

/**
 * Render prop that provides the current progress API context.
 */
export function ProgressContext({children}: ProgressContextProps): ReactNode {
  const context = useProgressContext()
  return renderProp(children, context)
}
