import {type ReactNode, useMemo, useState} from "react"

import {keepPreviousData, useQuery} from "@tanstack/react-query"

import {
  dateFilter,
  defineFilters,
  type IdentifiedFilterDefinition,
  listFilter,
  rangeFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"
import {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getTableFilterSetProps,
  type Header,
  type PaginationState,
} from "@qualcomm-ui/core/table"
import {
  CheckboxGroupFilter,
  DateFilter,
  FilterProvider,
  FilterSetProvider,
  SliderFilter,
  TextInputFilter,
  useFilterSet,
} from "@qualcomm-ui/react/filters"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {Popover} from "@qualcomm-ui/react/popover"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {
  TableColumnFilterAction,
  TableFilterBar,
} from "@qualcomm-ui/react/table-filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {
  type Device,
  enrolledAtPresets,
  fetchDevices,
  fetchFilterOptions,
  type FilterOptionsResult,
} from "./use-data"

// filter ids match the column ids
const filters = defineFilters({
  batteryLevel: rangeFilter(),
  category: listFilter(),
  enrolledAt: dateFilter({presets: enrolledAtPresets}),
  name: textFilter(),
  status: listFilter(),
})

interface FilterHeaderProps<TValue> {
  children: ReactNode
  filter: IdentifiedFilterDefinition
  header: Header<Device, TValue>
}

function FilterHeader<TValue>({
  children,
  filter,
  header,
}: FilterHeaderProps<TValue>) {
  const label = header.column.getFilterLabel()
  return (
    <div className="inline-flex w-full items-center justify-between gap-2">
      {label}
      <Popover
        label={label}
        trigger={<TableColumnFilterAction header={header} />}
      >
        <div className="w-56">
          <FilterProvider filter={filter}>{children}</FilterProvider>
        </div>
      </Popover>
    </div>
  )
}

const columnHelper = createColumnHelper<Device>()

/**
 * A render function header isn't a string, so each column sets `filterLabel`
 * for the popover label and the filter bar tags.
 */
const columns: ColumnDef<Device, any>[] = [
  columnHelper.accessor("name", {
    filterLabel: "Name",
    header: ({header}) => (
      <FilterHeader filter={filters.name} header={header}>
        <TextInputFilter placeholder="Search..." />
      </FilterHeader>
    ),
    size: 200,
  }),
  columnHelper.accessor("status", {
    filterLabel: "Status",
    header: ({header}) => (
      <FilterHeader filter={filters.status} header={header}>
        <CheckboxGroupFilter />
      </FilterHeader>
    ),
  }),
  columnHelper.accessor("category", {
    filterLabel: "Category",
    header: ({header}) => (
      <FilterHeader filter={filters.category} header={header}>
        <CheckboxGroupFilter />
      </FilterHeader>
    ),
  }),
  columnHelper.accessor("batteryLevel", {
    filterLabel: "Battery %",
    header: ({header}) => (
      <FilterHeader filter={filters.batteryLevel} header={header}>
        <SliderFilter />
      </FilterHeader>
    ),
  }),
  columnHelper.accessor("enrolledAt", {
    filterLabel: "Enrolled",
    header: ({header}) => (
      <FilterHeader filter={filters.enrolledAt} header={header}>
        <DateFilter />
      </FilterHeader>
    ),
    size: 200,
  }),
]

/**
 * Runs once per response, so the collections keep their identity across
 * renders.
 */
function selectFilterOptions({options, ranges}: FilterOptionsResult) {
  return {
    collections: Object.fromEntries(
      Object.entries(options).map(([field, items]) => [
        field,
        new ListCollection({items}),
      ]),
    ),
    ranges,
  }
}

export function FiltersServerSideDemo() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // the options and bounds cover every device, so they load once
  const {data: filterOptions} = useQuery({
    queryFn: fetchFilterOptions,
    queryKey: ["device-filter-options"],
    select: selectFilterOptions,
    staleTime: Infinity,
  })

  const {data, isFetching} = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchDevices({filters: columnFilters, ...pagination}),
    queryKey: ["device-search", columnFilters, pagination],
  })

  const table = useReactTable<Device>({
    columns,
    data: useMemo(() => data?.devices ?? [], [data?.devices]),
    getCoreRowModel: getCoreRowModel(),
    // the server filters and paginates the rows
    manualFiltering: true,
    manualPagination: true,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater)
      // manualPagination turns off the table's page reset on filter changes
      setPagination((prev) => ({...prev, pageIndex: 0}))
    },
    onPaginationChange: setPagination,
    pageCount: data?.pageCount,
    state: {columnFilters, pagination},
  })

  // one filter set shared by every column header and the filter bar
  const filterSet = useFilterSet({
    filters,
    ...getTableFilterSetProps(table),
    getFilterCollection: (id) => filterOptions?.collections[id],
    // the counts are for the filters of the latest response
    getFilterOptionCounts: (id) => data?.counts[id],
    getFilterRange: (id) => filterOptions?.ranges[id],
  })

  const paginationProps = useTablePagination(table, {
    totalCount: data?.totalDevices,
  })

  return (
    <div className="flex w-full flex-col p-2">
      <FilterSetProvider value={filterSet}>
        <Table.Root>
          <TableFilterBar />
          <Table.ScrollContainer>
            <Table.Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{width: header.getSize()}}
                      >
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
                  <Table.Row key={row.id}>
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
          <Table.Pagination {...paginationProps}>
            <Pagination.PageMetadata>
              {({count, pageEnd, pageStart}) =>
                isFetching ? (
                  <ProgressRing aria-label="Loading devices" size="xs" />
                ) : (
                  <>
                    {pageStart}-{pageEnd} of {count} results
                  </>
                )
              }
            </Pagination.PageMetadata>
            <Pagination.PageButtons />
          </Table.Pagination>
        </Table.Root>
      </FilterSetProvider>
    </div>
  )
}
