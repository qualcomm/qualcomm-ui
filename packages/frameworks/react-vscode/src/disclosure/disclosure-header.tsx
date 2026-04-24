import type {ReactElement, ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleTriggerProps,
} from "@qualcomm-ui/react-core/collapsible"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DisclosureHeaderProps = CoreCollapsibleTriggerProps & {
  children?: ReactNode
}

export function DisclosureHeader({
  children,
  className,
  ...props
}: DisclosureHeaderProps): ReactElement {
  return (
    <CoreCollapsible.Trigger
      className={clsx("vs-disclosure--header", className)}
      {...props}
    >
      {children}
    </CoreCollapsible.Trigger>
  )
}
