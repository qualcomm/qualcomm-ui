import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  CoreProgress,
  type CoreProgressRootProps,
} from "@qualcomm-ui/react-core/progress"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {
  ProgressCircleContextProvider,
  type ProgressCircleContextValue,
} from "./progress-circle-context"
import type {ProgressCircleSize} from "./progress-circle.types"

/**
 * @public
 * @interface
 */
export type ProgressCircleRootProps = Omit<CoreProgressRootProps, "children"> & {
  children?: ReactNode

  /**
   * The width and height of the progress circle. Supply as a number for
   * fine-grained customization.
   *
   * @default 'md'
   */
  size?: ProgressCircleSize
}

export function ProgressCircleRoot({
  children,
  className,
  size = "md",
  ...props
}: ProgressCircleRootProps): ReactElement {
  const progressCircleContext: ProgressCircleContextValue = useMemo(
    () => ({size}),
    [size],
  )

  return (
    <ProgressCircleContextProvider value={progressCircleContext}>
      <CoreProgress.Root
        className={clsx("vs-progress-circle", className)}
        {...props}
      >
        {children}
      </CoreProgress.Root>
    </ProgressCircleContextProvider>
  )
}
