// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTabs,
  type CoreTabsIndicatorProps,
} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "../qds-tabs-context"

export interface TabsIndicatorProps extends CoreTabsIndicatorProps {}

/**
 * Visual indicator that highlights the active tab. Renders a `<div>` element by
 * default. You only need to render a single `<Tabs.Indicator>` component per tab
 * list.
 *
 * @example
 * ```tsx
 * <Tabs.Root>
 *   <Tabs.List>
 *     <Tabs.Indicator />
 *     <Tab.Root value="tab-1">
 *       <Tab.Button>Tab 1</Tab.Button>
 *     </Tab.Root>
 *   </Tabs.List>
 * </Tabs.Root>
 * ```
 */
export function TabsIndicator(props: TabsIndicatorProps): ReactElement {
  const qdsContext = useQdsTabsContext()
  const mergedProps = mergeProps(qdsContext.getIndicatorBindings(), props)

  return <CoreTabs.Indicator {...mergedProps} />
}
