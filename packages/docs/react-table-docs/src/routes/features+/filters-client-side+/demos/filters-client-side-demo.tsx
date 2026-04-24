import {useMemo, useState} from "react"

import {Search} from "lucide-react"

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {Popover} from "@qualcomm-ui/react/popover"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TextInput} from "@qualcomm-ui/react/text-input"
import {useDebounce} from "@qualcomm-ui/react-core/effects"

import {TableColumnFilter} from "./filters"
import {type User, type UserColumnMeta, useUserData} from "./use-data"

export function FiltersClientSideDemo() {
  const {data = [], isFetching, refetch} = useUserData(100000)

  // always memoize your data and columns
  const userColumns: ColumnDef<User, any, UserColumnMeta>[] = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        id: "firstName",
        meta: {filterLabel: "First Name"},
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        id: "lastName",
        meta: {filterLabel: "Last Name"},
      },
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
        meta: {filterLabel: "Username"},
      },
      {
        accessorKey: "visitCount",
        header: "Visit Count",
        id: "visitCount",
        meta: {filterLabel: "Visit Count"},
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
        meta: {filterLabel: "Role"},
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
        meta: {filterLabel: "Account Status"},
      },
    ],
    [],
  )

  const [globalFilter, setGlobalFilter] = useState("")

  const refreshData = () => refetch()

  // Debounce the global filter for better performance. Registering on every
  // keystroke causes lag for the first few keys, as fewer characters can match the
  // majority of the table's data.
  const debouncedGlobalFilter = useDebounce(globalFilter, 150)

  const table = useReactTable<User>({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: debouncedGlobalFilter,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <TextInput
            aria-label="Search every column"
            className="w-56"
            onValueChange={setGlobalFilter}
            placeholder="Search every column..."
            size="sm"
            startIcon={Search}
            value={globalFilter}
          />
          <Button
            onClick={() => void refreshData()}
            size="sm"
            variant="outline"
          >
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
                          <div className="inline-flex w-full items-center justify-between gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanFilter() ? (
                              <Popover
                                trigger={
                                  <Table.ColumnFilterAction
                                    canFilter={header.column.getCanFilter()}
                                    isFiltered={header.column.getIsFiltered()}
                                  />
                                }
                              >
                                <TableColumnFilter
                                  column={header.column}
                                  table={table}
                                />
                              </Popover>
                            ) : null}
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

      <Button
        onClick={() =>
          console.info(
            "table.getSelectedRowModel().flatRows",
            table.getSelectedRowModel().flatRows,
          )
        }
        variant="outline"
      >
        Log table.getSelectedRowModel().flatRows
      </Button>
    </div>
  )
}
