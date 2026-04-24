import {type ReactElement, useMemo} from "react"

import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreProgressRing,
  type CoreProgressRingRootProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {ProgressCircleSize} from "./progress-circle.types"
import {VsProgressCircleContextProvider} from "./vs-progress-circle-context"
import {createVsProgressCircleApi} from "./vs-progress-circle.api"

export interface ProgressCircleRootProps extends CoreProgressRingRootProps {
  /**
   * The width and height of the progress circle. Supply as a number for
   * fine-grained customization.
   *
   * @default 'md'
   */
  size?: ProgressCircleSize
}

/**
 * The root container element for the progress circle. Renders a `<div>`
 * element by default.
 */
export function ProgressCircleRoot({
  children,
  size,
  ...props
}: ProgressCircleRootProps): ReactElement {
  const api = useMemo(
    () => createVsProgressCircleApi({size}, normalizeProps),
    [size],
  )
  const mergedProps = mergeProps(api.getRootBindings(), props)
  return (
    <VsProgressCircleContextProvider value={api}>
      <CoreProgressRing.Root {...mergedProps}>{children}</CoreProgressRing.Root>
    </VsProgressCircleContextProvider>
  )
}
