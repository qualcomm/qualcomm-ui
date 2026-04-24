import type {ReactElement, ReactNode} from "react"

import {CoreTabs, type CoreTabsRootProps} from "@qualcomm-ui/react-core/tabs"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type TabsProps = Omit<CoreTabsRootProps, "children"> & {
  children?: ReactNode
}

export function Tabs({
  children,
  className,
  ...props
}: TabsProps): ReactElement {
  return (
    <CoreTabs.Root className={clsx("vs-tabs", className)} {...props}>
      {children}
    </CoreTabs.Root>
  )
}
