import {Fragment, type ReactNode} from "react"

import type {Cell, Header, Row, TableInstance} from "@qualcomm-ui/core/table"
import {flexRender, Table} from "@qualcomm-ui/react/table"

import type {GuideUser} from "./fixtures.js"

interface Props {
  label: string
  renderCell?: (cell: Cell<GuideUser>) => ReactNode
  renderHeaderAction?: (header: Header<GuideUser>) => ReactNode
  renderRowAfter?: (row: Row<GuideUser>) => ReactNode
  table: TableInstance<GuideUser>
}

export function GuideTable({
  label,
  renderCell,
  renderHeaderAction,
  renderRowAfter,
  table,
}: Props): ReactNode {
  "use no memo"

  return (
    <Table.Root>
      <Table.ScrollContainer>
        <Table.Table>
          <caption>{label}</caption>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.HeaderCell
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {renderHeaderAction?.(header)}
                          </div>
                        )}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <Table.Row isSelected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id} cell={cell}>
                      {renderCell?.(cell) ??
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                    </Table.Cell>
                  ))}
                </Table.Row>
                {renderRowAfter?.(row)}
              </Fragment>
            ))}
          </Table.Body>
        </Table.Table>
      </Table.ScrollContainer>
    </Table.Root>
  )
}
