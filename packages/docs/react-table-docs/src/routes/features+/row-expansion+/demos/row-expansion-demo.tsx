import {useMemo, useState} from "react"

import {ChevronDown, ChevronRight} from "lucide-react"

import {
  type ColumnDef,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"

import {type User, useUserData} from "./use-data"

export function RowExpansionDemo() {
  const {data = [], isFetching, refetch} = useUserData(100, 5, 3)

  // always memoize your data and columns
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "username",
        cell: ({getValue, row}) => {
          const indeterminate = row.getIsSomeSelected()
          const checked = row.getIsSelected()
          return (
            <div
              className="inline-flex h-full items-center gap-2"
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              <>
                <Checkbox
                  aria-label={
                    row.getIsSelected() ? "Deselect row" : "Select row"
                  }
                  checked={checked}
                  indeterminate={indeterminate}
                  onCheckedChange={(nextState) => row.toggleSelected(nextState)}
                  size="sm"
                />
                {row.getCanExpand() ? (
                  <div className="inline-flex items-center justify-center">
                    <Table.RowExpandButton row={row} />
                  </div>
                ) : null}
                <span>{getValue() as string}</span>
              </>
            </div>
          )
        },
        header: ({table}) => {
          return (
            <>
              <div className="flex items-center gap-2">
                <Table.ColumnHeaderAction
                  aria-label="Expand all table rows"
                  icon={
                    table.getIsAllRowsExpanded() ? ChevronDown : ChevronRight
                  }
                  onClick={table.getToggleAllRowsExpandedHandler()}
                />
                <span>Username</span>
              </div>
            </>
          )
        },
        id: "username",
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
      },
      {
        accessorKey: "averageSessionDuration",
        header: "Avg Session Duration",
        id: "averageSessionDuration",
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
        id: "companyName",
        minSize: 200,
      },
      {
        accessorKey: "lastVisitedAt",
        header: "Last Visited At",
        id: "lastVisitedAt",
        minSize: 205,
      },
      {
        accessorKey: "visitCount",
        header: "Visit Count",
        id: "visitCount",
      },
    ],
    [],
  )
  const refreshData = () => refetch()

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSubRows: (row) => row.subRows,
    onExpandedChange: setExpanded,
    state: {
      expanded,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <Button onClick={() => void refreshData()} variant="outline">
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
                      >
                        {header.isPlaceholder ? null : (
                          <div className="inline-flex flex-col gap-1">
                            <div
                              className="inline-flex items-center justify-center"
                              style={{
                                minHeight: header.column.getCanFilter()
                                  ? 28
                                  : "auto",
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
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
                  <Table.Row key={row.id} isSelected={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
        className="max-h-[400px] overflow-y-auto"
        code={JSON.stringify(
          {expanded, rowSelection: table.getState().rowSelection},
          null,
          2,
        )}
        language="json"
      />
    </div>
  )
}
