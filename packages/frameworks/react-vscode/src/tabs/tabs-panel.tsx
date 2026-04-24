import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsPanelProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type TabsPanelProps = CoreTabsPanelProps & {
  children?: ReactNode
}

export function TabsPanel({children, ...props}: TabsPanelProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tabs__panel"}, props)

  return <CoreTabs.Panel {...mergedProps}>{children}</CoreTabs.Panel>
}
