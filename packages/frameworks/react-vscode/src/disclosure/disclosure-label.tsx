import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export interface DisclosureLabelProps {
  children?: ReactNode
  className?: string
}

export function DisclosureLabel({
  children,
  className,
}: DisclosureLabelProps): ReactElement {
  return (
    <span className={clsx("vs-disclosure--label", className)}>{children}</span>
  )
}
