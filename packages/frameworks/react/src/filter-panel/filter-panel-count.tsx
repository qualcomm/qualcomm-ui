// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useFilterPanelContext} from "@qualcomm-ui/react-core/filter-panel"
import {NumberBadge, type NumberBadgeProps} from "@qualcomm-ui/react/badge"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelCountProps extends NumberBadgeProps {}

/**
 * The total number of selected values in the panel. Hidden when no filters are
 * set. Renders a `<span>` element by default.
 */
export function FilterPanelCount(props: FilterPanelCountProps): ReactElement {
  const api = useFilterPanelContext()
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(
    qdsContext.getCountBindings(),
    {
      "aria-label": `${api.valueCount} selected`,
      hidden: api.valueCount === 0,
    },
    props,
  )

  return (
    <NumberBadge
      {...qdsContext.getCountBadgeProps()}
      value={api.valueCount}
      {...mergedProps}
    />
  )
}
