// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Funnel} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import type {TableColumnFilterActionProps} from "@qualcomm-ui/react/table-filters"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context.js"

/**
 * The props type lives in `table-filters`. A type-only import is erased at
 * runtime, so it doesn't create an import cycle between the two modules.
 */
export type {TableColumnFilterActionProps}

/**
 * An action button for opening a column filter menu or interface. Renders a
 * `<button>` element by default.
 *
 * @deprecated in next-release, import `TableColumnFilterAction` from
 * `@qualcomm-ui/react/table-filters`. Will be removed in the next major
 * version.
 */
export function TableColumnFilterAction({
  canFilter: canFilterProp,
  header,
  isFiltered,
  ...props
}: TableColumnFilterActionProps): ReactElement | null {
  const canFilter = canFilterProp || header?.column.getCanFilter()

  if (!canFilter) {
    return null
  }

  const mergedProps = mergeProps(
    qdsTableApi.getColumnFilterActionBindings({canFilter, header, isFiltered}),
    props,
  )

  return (
    <IconButton
      density="compact"
      icon={Funnel}
      size="sm"
      variant="ghost"
      {...mergedProps}
    />
  )
}
