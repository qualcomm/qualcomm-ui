// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
} from "@qualcomm-ui/core/table"
import {
  flexRender,
  Table,
  useReactTableCompilerCompat_unstable,
} from "@qualcomm-ui/react/table"
import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import {PropDescription} from "../prop-description"
import {PropName} from "../prop-name"
import {PropType} from "../prop-types"

import {getDisplayName} from "./function-params-utils"

const paramColumns: ColumnDef<QuiPropDeclaration>[] = [
  {
    cell: ({row}) => {
      const param = row.original
      const id = (param as QuiPropDeclaration & {id?: string}).id
      const displayParam = {...param, name: getDisplayName(param)}

      return (
        <>
          {id ? <span className="doc-props-table__row-anchor" id={id} /> : null}
          <div
            className="doc-props-table__name-cell"
            style={{
              paddingLeft: row.depth > 0 ? `${row.depth * 24}px` : undefined,
            }}
          >
            <div className="doc-props-item__description">
              <div
                className="doc-props-item__border"
                data-sub-row={booleanDataAttr(row.depth > 0)}
              >
                <PropName id={id} prop={displayParam} />
              </div>
              <PropDescription
                className="doc-props-table__description"
                prop={displayParam}
              />
            </div>
          </div>
        </>
      )
    },
    header: "Param",
    id: "param",
  },
  {
    cell: ({row}) => {
      return (
        <PropType disableReferenceExpansion={!row.depth} prop={row.original} />
      )
    },
    header: "Type",
    id: "type",
  },
]

export function FunctionParamsTable({
  params,
  returns,
}: {
  params: QuiPropDeclaration[]
  returns: ReactNode
}): ReactNode {
  const table = useReactTableCompilerCompat_unstable({
    columns: paramColumns,
    data: useMemo(() => params, [params]),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => Boolean(row.original.args?.length),
    getSubRows: (param) => param.args,
    initialState: {
      expanded: true,
    },
  })

  return (
    <div className="typedoc-props__table-wrapper" data-function-table>
      <Table.Root size="sm">
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeaderCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  data-sub-row={booleanDataAttr(row.depth > 0)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
        </Table.ScrollContainer>
        {returns}
      </Table.Root>
    </div>
  )
}
