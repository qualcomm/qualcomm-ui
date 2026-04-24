import {useMemo, useState} from "react"

import dayjs from "dayjs"

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
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
import {TextInput} from "@qualcomm-ui/react/text-input"
import {useDebounce} from "@qualcomm-ui/react-core/effects"

import {type User, useUserData} from "./use-data"

export function RowSelectionDemo() {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const {data = [], isFetching, refetch} = useUserData(100000)

  // always memoize your data and columns
  const userColumns: ColumnDef<User>[] = useMemo(
    () => [
      {
        cell: ({row}) => {
          const indeterminate = row.getIsSomeSelected()
          const checked = row.getIsSelected() && !indeterminate
          return (
            <Checkbox
              aria-label="Select row"
              checked={checked}
              indeterminate={indeterminate}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
              size="sm"
            />
          )
        },
        header: ({table}) => (
          <Checkbox
            aria-label="Select all rows"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
            size="sm"
          />
        ),
        id: "select",
      },
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
        size: 120,
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
      },
      {
        accessorKey: "createdAt",
        header: "Account Created On",
        id: "createdAt",
        minSize: 205,
        // we override this column's default sorting function for compatibility with
        // formatted date strings.
        sortingFn: (rowA, rowB, columnId) => {
          const valueA: string = rowA.getValue(columnId)
          const valueB: string = rowB.getValue(columnId)
          return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
        },
      },
      {
        accessorKey: "lastVisitedAt",
        header: "Last Visited At",
        id: "lastVisitedAt",
        minSize: 205,
        // we override this column's default sorting function for compatibility with
        // formatted date strings.
        sortingFn: (rowA, rowB, columnId) => {
          const valueA: string = rowA.getValue(columnId)
          const valueB: string = rowB.getValue(columnId)
          return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
        },
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

  // Debounce the global filter for better performance. Registering on every
  // keystroke causes lag for the first few keys, as fewer characters can match the
  // majority of the table's data.
  const debouncedGlobalFilter = useDebounce(globalFilter, 150)

  const table = useReactTable({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      globalFilter: debouncedGlobalFilter,
      rowSelection,
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
            value={globalFilter}
          />
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
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
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

      <Button
        className="self-start"
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
