import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressLabelProps,
} from "@qualcomm-ui/react-core/progress"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 * @interface
 */
export type ProgressCircleLabelProps = CoreProgressLabelProps & {
  children?: ReactNode
}

export function ProgressCircleLabel({
  children,
  className,
  ...props
}: ProgressCircleLabelProps): ReactElement {
  return (
    <CoreProgress.Label
      className={clsx("vs-progress-circle--label", className)}
      {...props}
    >
      {children}
    </CoreProgress.Label>
  )
}
