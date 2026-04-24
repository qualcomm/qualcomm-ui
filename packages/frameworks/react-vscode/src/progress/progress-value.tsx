import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressValueTextProps,
} from "@qualcomm-ui/react-core/progress"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 * @interface
 */
export type ProgressValueProps = CoreProgressValueTextProps & {
  children?: ReactNode
}

export function ProgressValue({
  children,
  className,
  ...props
}: ProgressValueProps): ReactElement {
  return (
    <CoreProgress.ValueText
      className={clsx("vs-progress--value", className)}
      {...props}
    >
      {children}
    </CoreProgress.ValueText>
  )
}
