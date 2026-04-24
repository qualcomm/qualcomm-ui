import type {ReactElement, ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleRootProps,
} from "@qualcomm-ui/react-core/collapsible"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DisclosureRootProps = Omit<CoreCollapsibleRootProps, "children"> & {
  children?: ReactNode
}

export function DisclosureRoot({
  children,
  className,
  ...props
}: DisclosureRootProps): ReactElement {
  return (
    <CoreCollapsible.Root
      className={clsx("vs-disclosure", className)}
      {...props}
    >
      {children}
    </CoreCollapsible.Root>
  )
}
