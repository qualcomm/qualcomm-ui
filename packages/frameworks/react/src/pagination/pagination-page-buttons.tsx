// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  ActionGroup,
  type ActionGroupProps,
} from "@qualcomm-ui/react/action-group"

import {Pagination} from "./index"

export interface PaginationPageButtonsProps
  extends Omit<ActionGroupProps, "children"> {}

/**
 * A shortcut for rendering the pagination page buttons. This is equivalent to:
 *
 * @example
 * ```tsx
 * <ActionGroup>
 *   <Pagination.PrevTrigger />
 *   <Pagination.PageItems />
 *   <Pagination.NextTrigger />
 * </ActionGroup>
 * ```
 */
export function PaginationPageButtons({
  ...props
}: PaginationPageButtonsProps): ReactElement {
  return (
    <ActionGroup {...props}>
      <Pagination.PrevTrigger />
      <Pagination.PageItems />
      <Pagination.NextTrigger />
    </ActionGroup>
  )
}
