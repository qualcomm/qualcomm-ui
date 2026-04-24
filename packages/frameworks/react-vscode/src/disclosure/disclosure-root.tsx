import type {ReactElement, ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleRootProps,
} from "@qualcomm-ui/react-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type DisclosureRootProps = Omit<CoreCollapsibleRootProps, "children"> & {
  children?: ReactNode
}

export function DisclosureRoot({
  children,
  ...props
}: DisclosureRootProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-disclosure"}, props)

  return (
    <CoreCollapsible.Root {...mergedProps}>{children}</CoreCollapsible.Root>
  )
}
