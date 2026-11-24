// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useFilterPanelCount} from "@qualcomm-ui/react-core/filter-panel"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {NumberBadge, type NumberBadgeProps} from "@qualcomm-ui/react/badge"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelCountProps extends NumberBadgeProps {}

/**
 * The total number of selected values in the panel. Hidden when no filters are
 * set. Renders a `<span>` element by default.
 */
export function FilterPanelCount(props: FilterPanelCountProps): ReactElement {
  const api = useFilterSetContext()
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(
    useFilterPanelCount(),
    qdsContext.getCountBindings(),
    props,
  )

  return (
    <NumberBadge
      {...qdsContext.getCountBadgeProps()}
      value={api.draftValueCount}
      {...mergedProps}
    />
  )
}
