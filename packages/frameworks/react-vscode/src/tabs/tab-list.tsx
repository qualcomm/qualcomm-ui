import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsListProps} from "@qualcomm-ui/react-core/tabs"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type TabListProps = CoreTabsListProps & {
  children?: ReactNode
}

export function TabList({
  children,
  className,
  ...props
}: TabListProps): ReactElement {
  return (
    <CoreTabs.List className={clsx("vs-tabs--list", className)} {...props}>
      {children}
    </CoreTabs.List>
  )
}
