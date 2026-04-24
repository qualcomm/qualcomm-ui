import type {ReactElement, ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleContentProps,
} from "@qualcomm-ui/react-core/collapsible"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DisclosureBodyProps = CoreCollapsibleContentProps & {
  children?: ReactNode
}

export function DisclosureBody({
  children,
  className,
  ...props
}: DisclosureBodyProps): ReactElement {
  return (
    <CoreCollapsible.Content
      className={clsx("vs-disclosure--body", className)}
      {...props}
    >
      {children}
    </CoreCollapsible.Content>
  )
}
