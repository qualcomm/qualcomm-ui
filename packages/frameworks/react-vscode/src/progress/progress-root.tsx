import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressRootProps,
} from "@qualcomm-ui/react-core/progress"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 * @interface
 */
export type ProgressRootProps = Omit<CoreProgressRootProps, "children"> & {
  children?: ReactNode
}

export function ProgressRoot({
  children,
  className,
  ...props
}: ProgressRootProps): ReactElement {
  return (
    <CoreProgress.Root className={clsx("vs-progress", className)} {...props}>
      {children}
    </CoreProgress.Root>
  )
}
