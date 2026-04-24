import type {ReactElement, ReactNode} from "react"

import {
  CoreTabs,
  type CoreTabsTabProps,
  useTabsContext,
} from "@qualcomm-ui/react-core/tabs"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {sharedClasses} from "../shared"

/**
 * @public
 */
export type TabProps = Omit<CoreTabsTabProps, "children"> & {
  children?: ReactNode
}

export function Tab({
  children,
  className,
  disabled,
  value,
  ...props
}: TabProps): ReactElement {
  const tabsContext = useTabsContext()
  const isSelected = tabsContext.value === value

  return (
    <CoreTabs.Tab
      className={clsx(
        "vs-tabs--tab",
        sharedClasses.disabled(disabled),
        className,
      )}
      disabled={disabled}
      value={value}
      {...props}
    >
      <CoreTabs.TabButton>
        {isSelected ? <div className="vs-tabs--bar" /> : null}
        {children}
      </CoreTabs.TabButton>
    </CoreTabs.Tab>
  )
}
