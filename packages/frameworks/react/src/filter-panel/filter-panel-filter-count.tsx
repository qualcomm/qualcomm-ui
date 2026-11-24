// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useFilterPanelContext} from "@qualcomm-ui/react-core/filter-panel"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {NumberBadge, type NumberBadgeProps} from "@qualcomm-ui/react/badge"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterCountProps extends NumberBadgeProps {}

/**
 * The number of values selected in the filter. Hidden when the filter is
 * empty. Renders a `<span>` element by default.
 */
export function FilterPanelFilterCount(
  props: FilterPanelFilterCountProps,
): ReactElement {
  const api = useFilterPanelContext()
  const filter = useFilter()
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(
    api.getFilterCountBindings(filter),
    qdsContext.getFilterCountBindings(),
    props,
  )

  return (
    <NumberBadge
      {...qdsContext.getFilterCountBadgeProps()}
      value={filter.count}
      {...mergedProps}
    />
  )
}
