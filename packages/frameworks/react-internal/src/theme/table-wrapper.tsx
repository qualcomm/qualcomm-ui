// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Table, type TableRootProps} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableWrapperProps extends TableRootProps {}

export function TableWrapper({
  children,
  ...props
}: TableWrapperProps): ReactElement {
  const mergedProps = mergeProps(
    {
      className: "hidden w-full sm:block mt-4",
      style: {
        "--cell-font": "var(--font-static-code-sm-default)",
        "--header-font": "var(--font-static-body-sm-bold)",
      },
    },
    props,
  )
  return (
    <Table.Root size="sm" {...mergedProps}>
      <Table.ScrollContainer className="qui-docs__mdx-scrollbar">
        <Table.Table>{children}</Table.Table>
      </Table.ScrollContainer>
    </Table.Root>
  )
}
