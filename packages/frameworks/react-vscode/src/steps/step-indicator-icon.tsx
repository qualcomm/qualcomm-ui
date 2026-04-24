import type {HTMLAttributes, ReactElement, ReactNode} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepIndicatorIconProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

export function StepIndicatorIcon({
  children,
  ...props
}: StepIndicatorIconProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__indicator-icon"}, props)
  return <span {...mergedProps}>{children}</span>
}
