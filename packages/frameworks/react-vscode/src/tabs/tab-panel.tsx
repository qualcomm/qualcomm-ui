import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsPanelProps} from "@qualcomm-ui/react-core/tabs"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type TabPanelProps = CoreTabsPanelProps & {
  children?: ReactNode
}

export function TabPanel({
  children,
  className,
  ...props
}: TabPanelProps): ReactElement {
  return (
    <CoreTabs.Panel className={clsx("vs-tabs--panel", className)} {...props}>
      {children}
    </CoreTabs.Panel>
  )
}
