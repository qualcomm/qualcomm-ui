import type {ReactElement, ReactNode} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DisclosureLabelProps {
  children?: ReactNode
  className?: string
}

export function DisclosureLabel({
  children,
  ...props
}: DisclosureLabelProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-disclosure__label"}, props)

  return <span {...mergedProps}>{children}</span>
}
