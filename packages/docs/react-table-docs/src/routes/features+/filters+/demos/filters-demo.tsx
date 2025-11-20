import {useState} from "react"

import {Search} from "lucide-react"

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
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

import {TableColumnFilter} from "./filters"
import {userColumns, useUserData} from "./use-data"

export function FiltersDemo() {
  const {data = [], isFetching, refetch} = useUserData(100000)

  const [globalFilter, setGlobalFilter] = useState("")

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
            className="w-56"
            onValueChange={setGlobalFilter}
            placeholder="Search every column..."
            size="sm"
            startIcon={Search}
            value={globalFilter}
          />
          <Button onClick={refreshData} size="sm" variant="outline">
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
                            <div className="inline-flex min-h-[28px] items-center justify-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                            {header.column.getCanFilter() ? (
                              <TableColumnFilter
                                column={header.column}
                                table={table}
                              />
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
