import {useMemo, useState} from "react"

import {useQuery} from "@tanstack/react-query"
import {Search} from "lucide-react"

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
} from "@qualcomm-ui/core/table"
import {useDebounce} from "@qualcomm-ui/react-core/effects"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
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

import {TableColumnFilter} from "./filters"
import {fetchData, type User, type UserColumnMeta} from "./use-data"

export function FiltersServerSideDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // always memoize your data and columns
  const userColumns: ColumnDef<User, any, UserColumnMeta>[] = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
        meta: {
          filterLabel: "Search by username",
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
        meta: {
          filterLabel: "Filter by role",
        },
        size: 120,
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
        meta: {
          filterLabel: "Filter by account status",
        },
        minSize: 170,
      },
      {
        accessorKey: "createdAt",
        enableColumnFilter: false,
        header: "Account Created On",
        id: "createdAt",
        minSize: 205,
      },
      {
        accessorKey: "lastVisitedAt",
        enableColumnFilter: false,
        header: "Last Visited At",
        id: "lastVisitedAt",
        minSize: 205,
      },
      {
        accessorKey: "visitCount",
        header: "Visit Count",
        id: "visitCount",
        meta: {
          filterLabel: "Filter by visit count",
        },
      },
    ],
    [],
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const debouncedColumnFilters = useDebounce(columnFilters, 300)
  const debouncedGlobalFilter = useDebounce(globalFilter, 300)

  const {data, fetchStatus, isFetching} = useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () =>
      fetchData({
        columnFilters: debouncedColumnFilters,
        globalFilter: debouncedGlobalFilter,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
      }),
    queryKey: [
      "data",
      pagination,
      debouncedColumnFilters,
      debouncedGlobalFilter,
      sorting,
    ],
  })

  const table = useReactTable({
    columns: userColumns,
    data: useMemo(() => data?.users ?? [], [data?.users]),
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: data?.pageCount,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
  })

  const paginationProps = useTablePagination(table, {
    totalCount: data?.totalUsers,
  })

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <TextInput
            className="w-56"
            inputProps={{"aria-label": "Search all columns"}}
            onValueChange={setGlobalFilter}
            placeholder="Search all columns..."
            size="sm"
            startIcon={Search}
            value={globalFilter}
          />
          <div className="text-neutral-primary font-body-sm flex items-center gap-1">
            <span>Query:</span>
            <span>{fetchStatus}</span>
            {isFetching ? <ProgressRing className="ml-1" size="xs" /> : null}
          </div>
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
                          <div className="inline-flex min-h-[28px] w-full items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              <Table.ColumnSortAction header={header} />
                            </div>
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
                                  availableFilters={data?.availableFilters}
                                  column={header.column}
                                  columnFilters={columnFilters}
                                  onColumnFiltersChange={setColumnFilters}
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
                {!data?.pageCount && isFetching ? (
                  <ProgressRing size="xs" />
                ) : (
                  `${pageStart}-${pageEnd} of ${count} results`
                )}
              </>
            )}
          </Pagination.PageMetadata>
          <Pagination.PageButtons />
        </Table.Pagination>
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {columnFilters, globalFilter, pagination, sorting},
          null,
          2,
        )}
        disableCopy
        language="json"
      />
    </div>
  )
}
