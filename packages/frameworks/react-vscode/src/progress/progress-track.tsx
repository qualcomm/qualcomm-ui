import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressTrackProps,
} from "@qualcomm-ui/react-core/progress"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 * @interface
 */
export type ProgressTrackProps = CoreProgressTrackProps & {
  children?: ReactNode
}

export function ProgressTrack({
  children,
  className,
  ...props
}: ProgressTrackProps): ReactElement {
  return (
    <CoreProgress.Track
      className={clsx("vs-progress--track", className)}
      {...props}
    >
      {children}
    </CoreProgress.Track>
  )
}
