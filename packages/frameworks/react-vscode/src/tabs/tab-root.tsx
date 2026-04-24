import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsTabProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {sharedClasses} from "../shared"

/**
 * @public
 */
export type TabRootProps = Omit<CoreTabsTabProps, "children"> & {
  children?: ReactNode
}

export function TabRoot({
  children,
  disabled,
  value,
  ...props
}: TabRootProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-tabs__tab"},
    {className: sharedClasses.disabled(disabled)},
    props,
  )

  return (
    <CoreTabs.Tab disabled={disabled} value={value} {...mergedProps}>
      {children}
    </CoreTabs.Tab>
  )
}
