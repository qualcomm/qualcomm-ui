import {useMemo, useState} from "react"

import {keepPreviousData, useQuery} from "@tanstack/react-query"

import {
  dateFilter,
  defineFilters,
  listFilter,
  rangeFilter,
} from "@qualcomm-ui/core/filters"
import {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getTableFilterSetProps,
  type PaginationState,
} from "@qualcomm-ui/core/table"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxGroupFilter,
  ComboboxFilter,
  DateFilter,
  FilterSetProvider,
  SliderFilter,
  useFilterSet,
} from "@qualcomm-ui/react/filters"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TableFilterBar} from "@qualcomm-ui/react/table-filters"
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
  model: listFilter(),
  status: listFilter(),
})

const columnHelper = createColumnHelper<Device>()

const columns: ColumnDef<Device, any>[] = [
  columnHelper.accessor("name", {header: "Name"}),
  columnHelper.accessor("status", {header: "Status"}),
  columnHelper.accessor("category", {header: "Category"}),
  columnHelper.accessor("model", {header: "Model"}),
  columnHelper.accessor("batteryLevel", {header: "Battery %"}),
  columnHelper.accessor("enrolledAt", {header: "Enrolled"}),
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

export function FiltersServerSidePanelDemo() {
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

  // one filter set shared by the panel and the filter bar
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
    <FilterSetProvider value={filterSet}>
      <div className="flex w-full items-start gap-4 p-2">
        {/* preview */}
        <FilterPanel.RootProvider className="w-64 shrink-0" value={filterSet}>
          <FilterPanel.Header>
            <FilterPanel.Heading>
              Filters <FilterPanel.Count />
            </FilterPanel.Heading>
            <FilterPanel.ClearButton />
          </FilterPanel.Header>
          <FilterPanel.Filter filter={filters.status}>
            <CheckboxGroupFilter />
          </FilterPanel.Filter>
          <FilterPanel.Filter filter={filters.category}>
            <CheckboxGroupFilter />
          </FilterPanel.Filter>
          <FilterPanel.Filter filter={filters.model}>
            <ComboboxFilter />
          </FilterPanel.Filter>
          <FilterPanel.Filter filter={filters.batteryLevel}>
            <SliderFilter />
          </FilterPanel.Filter>
          <FilterPanel.Filter filter={filters.enrolledAt}>
            <DateFilter />
          </FilterPanel.Filter>
        </FilterPanel.RootProvider>
        {/* preview */}
        <Table.Root className="min-w-0 flex-1">
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
      </div>
    </FilterSetProvider>
  )
}
