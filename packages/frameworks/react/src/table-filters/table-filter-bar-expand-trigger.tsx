// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {OverflowListState} from "@qualcomm-ui/core/overflow-list"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useOverflowListContext} from "@qualcomm-ui/react-core/overflow-list"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterBarExpandTriggerProps extends Omit<
  ButtonProps,
  "children"
> {
  /**
   * The trigger's content. Pass a function to render different content for
   * each state. `hiddenCount` is the number of applied filters hidden while
   * collapsed.
   *
   * @default ({expanded, hiddenCount}) => (expanded ? "Show less" : `+${hiddenCount} more`)
   */
  children?: RenderProp<OverflowListState>
}

/**
 * Shows or hides the applied filters that don't fit on one row. Render it
 * within the `TableFilterBar.FilterList` so that it follows the last visible
 * filter. Hidden while every applied filter fits. Renders a `<button>` element
 * by default.
 */
export function TableFilterBarExpandTrigger({
  children,
  id,
  ...props
}: TableFilterBarExpandTriggerProps): ReactElement {
  const qdsContext = useQdsTableRootContext()
  const overflowList = useOverflowListContext()
  const {expanded, hiddenCount} = overflowList

  const mergedProps = mergeProps(
    overflowList.getTriggerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    qdsContext.getFilterBarExpandTriggerBindings({expanded}),
    props,
  )

  return (
    <Button {...mergedProps}>
      {renderProp(children ?? DefaultContent, {expanded, hiddenCount})}
    </Button>
  )
}

const DefaultContent: RenderProp<OverflowListState> = ({
  expanded,
  hiddenCount,
}): ReactNode => (expanded ? "Show less" : `+${hiddenCount} more`)
