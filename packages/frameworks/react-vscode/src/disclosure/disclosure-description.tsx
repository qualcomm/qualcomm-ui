import type {ReactElement, ReactNode} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DisclosureDescriptionProps {
  children?: ReactNode
  className?: string
}

export function DisclosureDescription({
  children,
  ...props
}: DisclosureDescriptionProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-disclosure__description"},
    props,
  )

  return <span {...mergedProps}>{children}</span>
}
