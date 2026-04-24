import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsListProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type TabsListProps = CoreTabsListProps & {
  children?: ReactNode
}

export function TabsList({children, ...props}: TabsListProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tabs__list"}, props)

  return <CoreTabs.List {...mergedProps}>{children}</CoreTabs.List>
}
