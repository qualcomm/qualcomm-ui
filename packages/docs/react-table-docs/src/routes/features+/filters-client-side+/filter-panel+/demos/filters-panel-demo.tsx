import {useMemo} from "react"

import {
  dateFilter,
  type DateFilterPreset,
  defineFilters,
  listFilter,
  rangeFilter,
} from "@qualcomm-ui/core/filters"
import {
  type ColumnDef,
  createColumnHelper,
  createDateFilterFn,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getTableFilterSetProps,
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
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TableFilterBar} from "@qualcomm-ui/react/table-filters"

import {type Device, useDeviceData} from "./use-data"

const presets: DateFilterPreset[] = [
  {label: "2025", range: () => ["2025-01-01", "2025-12-31"], value: "2025"},
  {label: "2026", range: () => ["2026-01-01", "2026-12-31"], value: "2026"},
]

// filter ids match the column ids
const filters = defineFilters({
  batteryLevel: rangeFilter(),
  category: listFilter(),
  enrolledAt: dateFilter({presets}),
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
  columnHelper.accessor("enrolledAt", {
    // custom date presets need a filter function that knows them
    filterFn: createDateFilterFn(presets),
    header: "Enrolled",
  }),
]

export function FiltersPanelDemo() {
  const {data} = useDeviceData("10k")

  const table = useReactTable<Device>({
    columns,
    data: useMemo(() => data ?? [], [data]),
    getCoreRowModel: getCoreRowModel(),
    // faceting supplies the option counts and the slider bounds
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // one filter set shared by the panel and the filter bar
  const filterSet = useFilterSet({filters, ...getTableFilterSetProps(table)})

  const paginationProps = useTablePagination(table)

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
              {({count, pageEnd, pageStart}) => (
                <>
                  {pageStart}-{pageEnd} of {count} results
                </>
              )}
            </Pagination.PageMetadata>
            <Pagination.PageButtons />
          </Table.Pagination>
        </Table.Root>
      </div>
    </FilterSetProvider>
  )
}
