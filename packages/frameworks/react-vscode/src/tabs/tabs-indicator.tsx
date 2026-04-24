import type {ReactElement} from "react"

import {
  CoreTabs,
  type CoreTabsIndicatorProps,
} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface TabsIndicatorProps extends CoreTabsIndicatorProps {}

/**
 * Visual indicator that highlights the active tab. Place inside `<Tabs.List>`.
 */
export function TabsIndicator(props: TabsIndicatorProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tabs__indicator"}, props)

  return <CoreTabs.Indicator {...mergedProps} />
}
