// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTabs, type CoreTabsTabProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "../qds-tabs-context"

export interface TabRootProps extends CoreTabsTabProps {}

/**
 * Groups all parts of a single tab. Renders a `<div>` element by default.
 */
export function TabRoot(props: TabRootProps): ReactElement {
  const qdsContext = useQdsTabsContext()
  const mergedProps = mergeProps(qdsContext.getTabBindings(), props)

  return <CoreTabs.Tab {...mergedProps} />
}
