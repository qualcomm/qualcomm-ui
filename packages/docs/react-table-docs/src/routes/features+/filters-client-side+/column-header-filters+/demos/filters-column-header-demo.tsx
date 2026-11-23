import {type ReactNode, useMemo} from "react"

import {
  dateFilter,
  type DateFilterPreset,
  defineFilters,
  type IdentifiedFilterDefinition,
  listFilter,
  rangeFilter,
  textFilter,
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
  type Header,
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

import {type Device, useDeviceData} from "./use-data"

const presets: DateFilterPreset[] = [
  {label: "2025", range: () => ["2025-01-01", "2025-12-31"], value: "2025"},
  {label: "2026", range: () => ["2026-01-01", "2026-12-31"], value: "2026"},
]

const filters = defineFilters({
  batteryLevel: rangeFilter(),
  category: listFilter(),
  enrolledAt: dateFilter({presets}),
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
    filterFn: createDateFilterFn(presets),
    filterLabel: "Enrolled",
    header: ({header}) => (
      <FilterHeader filter={filters.enrolledAt} header={header}>
        <DateFilter />
      </FilterHeader>
    ),
    size: 200,
  }),
]

export function FiltersColumnHeaderDemo() {
  const {data} = useDeviceData("10k")

  const table = useReactTable<Device>({
    columns,
    data: useMemo(() => data ?? [], [data]),
    getCoreRowModel: getCoreRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // one filter set shared by every column header and the filter bar
  const filterSet = useFilterSet({filters, ...getTableFilterSetProps(table)})

  const paginationProps = useTablePagination(table)

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
              {({count, pageEnd, pageStart}) => (
                <>
                  {pageStart}-{pageEnd} of {count} results
                </>
              )}
            </Pagination.PageMetadata>
            <Pagination.PageButtons />
          </Table.Pagination>
        </Table.Root>
      </FilterSetProvider>
    </div>
  )
}
