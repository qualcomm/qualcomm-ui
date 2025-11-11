// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTabs, type CoreTabsListProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "../qds-tabs-context"

export interface TabsListProps extends CoreTabsListProps {}

/**
 * Container for the tab buttons. Renders a `<div>` element by default.
 */
export function TabsList(props: TabsListProps): ReactElement {
  const qdsContext = useQdsTabsContext()
  const mergedProps = mergeProps(qdsContext.getListBindings(), props)

  return <CoreTabs.List {...mergedProps} />
}
