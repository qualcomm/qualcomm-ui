import type {ReactElement, ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleTriggerProps,
} from "@qualcomm-ui/react-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type DisclosureHeaderProps = CoreCollapsibleTriggerProps & {
  children?: ReactNode
}

export function DisclosureHeader({
  children,
  ...props
}: DisclosureHeaderProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-disclosure__header"}, props)

  return (
    <CoreCollapsible.Trigger {...mergedProps}>
      {children}
    </CoreCollapsible.Trigger>
  )
}
