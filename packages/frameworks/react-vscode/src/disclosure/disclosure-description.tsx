import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export interface DisclosureDescriptionProps {
  children?: ReactNode
  className?: string
}

export function DisclosureDescription({
  children,
  className,
}: DisclosureDescriptionProps): ReactElement {
  return (
    <span className={clsx("vs-disclosure--description", className)}>
      {children}
    </span>
  )
}
