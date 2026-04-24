import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressBarProps,
} from "@qualcomm-ui/react-core/progress"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 * @interface
 */
export type ProgressBarProps = CoreProgressBarProps

export function ProgressBar({
  className,
  ...props
}: ProgressBarProps): ReactElement {
  return (
    <CoreProgress.Bar className={clsx("vs-progress--bar", className)} {...props} />
  )
}
