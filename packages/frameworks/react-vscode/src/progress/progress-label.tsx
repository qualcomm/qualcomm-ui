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
export type ProgressLabelProps = CoreProgressLabelProps & {
  children?: ReactNode
}

export function ProgressLabel({
  children,
  className,
  ...props
}: ProgressLabelProps): ReactElement {
  return (
    <CoreProgress.Label
      className={clsx("vs-progress--label", className)}
      {...props}
    >
      {children}
    </CoreProgress.Label>
  )
}
