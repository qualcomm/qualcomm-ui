import type {ReactNode} from "react"

import {CoreTabs, type CoreTabsContextProps} from "@qualcomm-ui/react-core/tabs"

/**
 * @public
 */
export interface TabsContextProps extends CoreTabsContextProps {}

export function TabsContext(props: TabsContextProps): ReactNode {
  return <CoreTabs.Context {...props} />
}
