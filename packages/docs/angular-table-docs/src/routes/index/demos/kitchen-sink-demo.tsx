import {useContext, useEffect, useMemo, useState} from "react"

import dayjs from "dayjs"
import {Search} from "lucide-react"

import {
  type CellContext,
  type Column,
  type ColumnDef,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type RowPinningState,
  type TableInstance,
} from "@qualcomm-ui/core/table"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TextInput} from "@qualcomm-ui/react/text-input"

import {makeUserData, type User} from "../../../utils/data"

import {RowPinningCell} from "./row-pinning-cell"
import {
  RowPinningContext,
  type RowPinningContextState,
} from "./row-pinning-context"
import {RowPinningHeader} from "./row-pinning-header"

const columns: ColumnDef<User>[] = [
  {
    cell: (context) => <RowPinningCell context={context} />,
    header: () => <RowPinningHeader />,
    id: "pin",
  },
  {
    accessorKey: "username",
    cell: ({getValue, row}: CellContext<User, any>) => {
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
              checked={checked}
              hiddenInputProps={{
                "aria-label": row.getIsSelected()
                  ? "Deselect row"
                  : "Select row",
              }}
              indeterminate={indeterminate}
              onCheckedChange={(checked) => {
                row.toggleSelected(checked)
              }}
            />
            {row.getCanExpand() ? <Table.RowExpandButton row={row} /> : null}
            <span>{getValue()}</span>
          </>
        </div>
      )
    },
    header: "Username",
    minSize: 250,
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    minSize: 135,
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
]

// we cache the data after this component is first loaded.
let personData: User[] = []

export function KitchenSinkDemo() {
  const [data, setData] = useState<User[]>(personData)

  useEffect(() => {
    if (!data?.length) {
      personData = makeUserData(1000, 2, 2)
      setData(personData)
    }
  }, [data?.length])

  const [keepPinnedRows, setKeepPinnedRows] = useState(false)
  const [includeLeafRows, setIncludeLeafRows] = useState(true)
  const [includeParentRows, setIncludeParentRows] = useState(true)

  const context: RowPinningContextState = useMemo(
    () => ({
      includeLeafRows,
      includeParentRows,
      keepPinnedRows,
      setIncludeLeafRows,
      setIncludeParentRows,
      setKeepPinnedRows,
    }),
    [includeLeafRows, includeParentRows, keepPinnedRows],
  )

  return (
    <RowPinningContext.Provider value={context}>
      <LocalTable data={data} />
    </RowPinningContext.Provider>
  )
}

function LocalTable({data}: {data: User[]}) {
  const [globalFilter, setGlobalFilter] = useState("")
  const {keepPinnedRows} = useContext(RowPinningContext)

  // table states
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    bottom: [],
    top: [],
  })
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row) => row.subRows,
    keepPinnedRows,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onRowPinningChange: setRowPinning,
    sortDescFirst: true,
    state: {
      expanded,
      globalFilter,
      rowPinning,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <Table.Root className="mt-4">
      <Table.ActionBar>
        <TextInput
          className="w-56"
          onValueChange={setGlobalFilter}
          placeholder="Global Filter"
          startIcon={Search}
          value={globalFilter}
        />
      </Table.ActionBar>
      <Table.ScrollContainer>
        <Table.Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) {
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                      />
                    )
                  }
                  return (
                    <Table.HeaderCell
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{minWidth: header.column.columnDef.minSize}}
                    >
                      <div className="inline-flex flex-col gap-1">
                        <div className="inline-flex min-h-[28px] items-center justify-center">
                          <div className="inline-flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <Table.ColumnSortAction header={header} />
                          </div>
                        </div>
                        {header.column.getCanFilter() ? (
                          <Filter column={header.column} table={table} />
                        ) : null}
                      </div>
                    </Table.HeaderCell>
                  )
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getTopRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
            {table.getCenterRows().map((row) => {
              return (
                <Table.Row key={row.id} isSelected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Cell
                        key={cell.id}
                        style={{minWidth: cell.column.columnDef.minSize}}
                      >
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
            {table.getBottomRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
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
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<User, any>
  table: TableInstance<User>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === "number" ? (
    <div className="flex gap-2">
      <TextInput
        className="w-24"
        inputProps={{min: 0, type: "number"}}
        onValueChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder="Min"
        size="sm"
        value={(columnFilterValue as [string, number])?.[0] ?? ""}
      />
      <TextInput
        className="w-24"
        inputProps={{min: 0, type: "number"}}
        onValueChange={(value) =>
          column.setFilterValue((old: [string, string]) => [old?.[0], value])
        }
        placeholder="Max"
        size="sm"
        value={(columnFilterValue as [string, string])?.[1] ?? ""}
      />
    </div>
  ) : (
    <TextInput
      className="w-36"
      onValueChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      size="sm"
      value={(columnFilterValue ?? "") as string}
    />
  )
}

function PinnedRow({row, table}: {row: Row<User>; table: TableInstance<User>}) {
  return (
    <Table.Row
      className="sticky"
      isSelected
      style={{
        bottom:
          row.getIsPinned() === "bottom"
            ? `${
                (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
              }px`
            : undefined,
        top:
          row.getIsPinned() === "top"
            ? `${row.getPinnedIndex() * 26 + 48}px`
            : undefined,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <Table.Cell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
