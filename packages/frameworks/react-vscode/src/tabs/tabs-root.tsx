import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsRootProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type TabsRootProps = Omit<CoreTabsRootProps, "children"> & {
  children?: ReactNode
}

export function TabsRoot({children, ...props}: TabsRootProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tabs__root"}, props)

  return <CoreTabs.Root {...mergedProps}>{children}</CoreTabs.Root>
}
