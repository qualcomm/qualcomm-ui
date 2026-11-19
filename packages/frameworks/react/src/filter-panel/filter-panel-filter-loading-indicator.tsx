// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useCollapsibleContext} from "@qualcomm-ui/react-core/collapsible"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterLoadingIndicatorProps extends ElementRenderProp<"span"> {}

/**
 * Shows a progress ring while the filter's collection refetches, or while it
 * loads with the filter collapsed. On the first load of an expanded filter, the
 * control shows its own loading status instead. Renders nothing otherwise.
 * Renders a `<span>` element by default.
 */
export function FilterPanelFilterLoadingIndicator({
  children,
  ...props
}: FilterPanelFilterLoadingIndicatorProps): ReactElement | null {
  const collapsible = useCollapsibleContext()
  const filter = useFilter()
  const qdsContext = useQdsFilterPanelContext()
  const state = filter.collectionState

  if (state?.status !== "loading" || (collapsible.open && !state.collection)) {
    return null
  }

  const mergedProps = mergeProps(
    qdsContext.getFilterLoadingIndicatorBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children ?? (
        <ProgressRing
          {...qdsContext.getFilterLoadingIndicatorProgressRingProps()}
        />
      )}
    </PolymorphicElement>
  )
}
