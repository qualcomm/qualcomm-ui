import {useState} from "react"

import {Combine, Ungroup} from "lucide-react"

import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  type GroupingState,
} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"

import {type User, useUserData} from "./use-data"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    cell: (info) => info.getValue(),
    header: "First Name",
  },
  {
    accessorFn: (row) => row.lastName,
    cell: (info) => info.getValue(),
    header: "Last Name",
    id: "lastName",
  },
  {
    accessorKey: "visitCount",
    aggregationFn: "sum",
    header: "Visits",
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
  },
]

export default function GroupingDemo() {
  const {data = [], isFetching, refetch} = useUserData(10000)
  const refreshData = () => refetch()

  const [grouping, setGrouping] = useState<GroupingState>([])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: data.length ? getGroupedRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    onGroupingChange: setGrouping,
    state: {
      grouping,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <Button onClick={refreshData} variant="outline">
            Refresh Data
          </Button>
          {isFetching ? <ProgressRing size="xs" /> : null}
        </Table.ActionBar>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{width: header.getSize()}}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1">
                            {header.column.getCanGroup() ? (
                              // If the header can be grouped, let's add a toggle
                              <Table.ColumnHeaderAction
                                icon={
                                  header.column.getIsGrouped()
                                    ? Ungroup
                                    : Combine
                                }
                                onClick={header.column.getToggleGroupingHandler()}
                                title={
                                  header.column.getIsGrouped()
                                    ? "Ungroup"
                                    : "Group"
                                }
                              />
                            ) : null}{" "}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </div>
                        )}
                      </Table.HeaderCell>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.Cell key={cell.id} cell={cell}>
                          {cell.getIsGrouped() ? (
                            // If it's a grouped cell, add an expander and row
                            // count
                            <div className="inline-flex items-center gap-2">
                              {row.getCanExpand() ? (
                                <Table.RowExpandButton row={row} />
                              ) : null}
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}{" "}
                              ({row.subRows.length})
                            </div>
                          ) : cell.getIsAggregated() ? (
                            // If the cell is aggregated, use the Aggregated
                            // renderer for cell
                            flexRender(
                              cell.column.columnDef.aggregatedCell ??
                                cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                            // Otherwise, just render the regular cell
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          )}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Table>
        </Table.ScrollContainer>
        <Table.Pagination {...paginationProps}>
          <Pagination.PageMetadata>
            {({count, pageEnd, pageStart}) => (
              <>
                {pageStart}-{pageEnd} of {count} results
              </>
            )}
          </Pagination.PageMetadata>
          <Pagination.PageButtons />
        </Table.Pagination>
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify({grouping}, null, 2)}
        disableCopy
        language="json"
      />
    </div>
  )
}
