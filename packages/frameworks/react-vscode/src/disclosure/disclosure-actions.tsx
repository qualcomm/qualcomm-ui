import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export interface DisclosureActionsProps {
  children?: ReactNode
  className?: string
}

export function DisclosureActions({
  children,
  className,
}: DisclosureActionsProps): ReactElement {
  return (
    <div className={clsx("vs-disclosure--actions", className)}>{children}</div>
  )
}
