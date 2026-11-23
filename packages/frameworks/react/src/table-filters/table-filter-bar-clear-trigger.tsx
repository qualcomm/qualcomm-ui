// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterBarClearTriggerProps extends ButtonProps {}

/**
 * Removes every applied filter when clicked. Renders a `<button>` element by
 * default.
 */
export function TableFilterBarClearTrigger({
  children = "Clear all",
  ...props
}: TableFilterBarClearTriggerProps): ReactElement {
  const qdsContext = useQdsTableRootContext()
  const filterSet = useFilterSetContext()

  const mergedProps = mergeProps(
    qdsContext.getFilterBarClearTriggerBindings(),
    {onClick: () => filterSet.clearAll()},
    props,
  )

  return <Button {...mergedProps}>{children}</Button>
}
