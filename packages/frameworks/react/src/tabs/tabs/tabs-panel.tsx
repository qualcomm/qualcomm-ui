// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTabs, type CoreTabsPanelProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "../qds-tabs-context"

export interface TabsPanelProps extends CoreTabsPanelProps {}

/**
 * Content area associated with a tab. Renders a `<div>` element by default.
 */
export function TabsPanel(props: TabsPanelProps): ReactElement {
  const qdsContext = useQdsTabsContext()
  const mergedProps = mergeProps(qdsContext.getPanelBindings(), props)

  return <CoreTabs.Panel {...mergedProps} />
}
