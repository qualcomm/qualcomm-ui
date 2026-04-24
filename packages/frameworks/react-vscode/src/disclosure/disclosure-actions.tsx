import type {ReactElement, ReactNode} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DisclosureActionsProps {
  children?: ReactNode
  className?: string
}

export function DisclosureActions({
  children,
  ...props
}: DisclosureActionsProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-disclosure__actions"}, props)

  return <div {...mergedProps}>{children}</div>
}
