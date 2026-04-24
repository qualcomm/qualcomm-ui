import type {ReactElement, ReactNode} from "react"

import {
  CoreTabs,
  type CoreTabsTabButtonProps,
} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type TabButtonProps = CoreTabsTabButtonProps & {
  children?: ReactNode
}

export function TabButton({children, ...props}: TabButtonProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-tabs__tab-button"}, props)

  return <CoreTabs.TabButton {...mergedProps}>{children}</CoreTabs.TabButton>
}
