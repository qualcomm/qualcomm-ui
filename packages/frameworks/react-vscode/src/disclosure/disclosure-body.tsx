import type {ReactElement, ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleContentProps,
} from "@qualcomm-ui/react-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type DisclosureBodyProps = CoreCollapsibleContentProps & {
  children?: ReactNode
}

export function DisclosureBody({
  children,
  ...props
}: DisclosureBodyProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-disclosure__body"}, props)

  return (
    <CoreCollapsible.Content {...mergedProps}>
      {children}
    </CoreCollapsible.Content>
  )
}
