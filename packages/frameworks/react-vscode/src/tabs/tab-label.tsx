import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export interface TabLabelProps {
  children?: ReactNode
  className?: string
}

export function TabLabel({children, className}: TabLabelProps): ReactElement {
  return (
    <span className={clsx("vs-tabs--tab-label", className)}>{children}</span>
  )
}
