import type {ReactElement} from "react"

import {
  CoreTabs,
  type CoreTabsTabDismissButtonProps,
} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

/**
 * @public
 */
export interface TabDismissButtonProps extends CoreTabsTabDismissButtonProps {}

export function TabDismissButton(props: TabDismissButtonProps): ReactElement {
  const mergedProps = mergeProps(
    {"aria-label": "Dismiss tab", className: "vs-tabs__tab-dismiss-button"},
    props,
  )

  return (
    <CoreTabs.TabDismissButton {...mergedProps}>
      <Icon icon="close" size={12} />
    </CoreTabs.TabDismissButton>
  )
}
