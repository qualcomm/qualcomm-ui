import {useMemo, useState} from "react"

import {ArrowDown, ArrowUp, ChevronDown, ChevronRight, X} from "lucide-react"

import {
  type CellContext,
  type Column,
  type ColumnDef,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type Row,
  type RowPinningState,
  type TableInstance,
} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {NumberInput} from "@qualcomm-ui/react/number-input"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TextInput} from "@qualcomm-ui/react/text-input"

import {type User, useUserData} from "./use-data"

export default function RowPinningDemo() {
  // table states
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    bottom: [],
    top: [],
  })
  const [expanded, setExpanded] = useState<ExpandedState>({})

  // demo states
  const [keepPinnedRows, setKeepPinnedRows] = useState(false)
  const [includeLeafRows, setIncludeLeafRows] = useState(true)
  const [includeParentRows, setIncludeParentRows] = useState(true)

  const columns: ColumnDef<User>[] = useMemo<ColumnDef<User>[]>(
    () => [
      {
        cell: ({row}) =>
          row.getIsPinned() ? (
            <Table.CellAction
              icon={X}
              onClick={() => row.pin(false, includeLeafRows, includeParentRows)}
            />
          ) : (
            <div className="flex gap-1">
              <Table.CellAction
                icon={ArrowUp}
                onClick={() =>
                  row.pin("top", includeLeafRows, includeParentRows)
                }
              />
              <Table.CellAction
                icon={ArrowDown}
                onClick={() =>
                  row.pin("bottom", includeLeafRows, includeParentRows)
                }
              />
            </div>
          ),
        header: "Pin",
        id: "pin",
      },
      {
        accessorKey: "username",
        cell: ({getValue, row}: CellContext<User, any>) => {
          return (
            <div
              className="inline-flex items-center gap-2"
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              <>
                {row.getCanExpand() ? (
                  <Table.RowExpandButton row={row} />
                ) : null}
                <span>{getValue()}</span>
              </>
            </div>
          )
        },
        header: ({table}) => {
          return (
            <div className="flex items-center gap-2">
              <Table.ColumnHeaderAction
                icon={table.getIsAllRowsExpanded() ? ChevronDown : ChevronRight}
                onClick={table.getToggleAllRowsExpandedHandler()}
              />
              <span>Username</span>
            </div>
          )
        },
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
        minSize: 220,
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
    [includeLeafRows, includeParentRows],
  )

  const {data = [], isFetching, refetch} = useUserData(1000, 2, 2)
  const refreshData = () => refetch()

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSubRows: (row) => row.subRows,
    initialState: {pagination: {pageIndex: 0, pageSize: 10}},
    keepPinnedRows,
    onExpandedChange: setExpanded,
    onRowPinningChange: setRowPinning,
    state: {
      expanded,
      rowPinning,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <div className="align-center vertical flex flex-col gap-2">
        <Checkbox
          checked={includeParentRows}
          label="Include Parent Rows When Pinning Child"
          onCheckedChange={(checked) => setIncludeParentRows(checked)}
          size="sm"
        />

        <Checkbox
          checked={includeLeafRows}
          label="Include Leaf Rows When Pinning Parent"
          onCheckedChange={(checked) => setIncludeLeafRows(checked)}
          size="sm"
        />

        <Checkbox
          checked={keepPinnedRows}
          label="Persist Pinned Rows across Pagination and Filtering"
          onCheckedChange={(checked) => setKeepPinnedRows(checked)}
          size="sm"
        />
      </div>

      <Table.Root>
        <Table.ActionBar>
          <Button onClick={refreshData} variant="outline">
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
                              <Filter column={header.column} table={table} />
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
              {table.getTopRows().map((row) => (
                <PinnedRow key={row.id} row={row} table={table} />
              ))}
              {table.getCenterRows().map((row) => {
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

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {
            rowPinning: table.getState().rowPinning,
            rowSelection: table.getState().rowSelection,
          },
          null,
          2,
        )}
        disableCopy
        language="json"
      />
    </div>
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

interface FilterProps {
  column: Column<User>
  table: TableInstance<User>
}

function Filter({column, table}: FilterProps) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === "number" ? (
    <MinMaxNumberFilter column={column} table={table} />
  ) : (
    <TextInput
      className="w-32"
      onValueChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      size="sm"
      value={(column.getFilterValue() as string) ?? ""}
    />
  )
}

function MinMaxNumberFilter({column}: FilterProps) {
  const columnFilterValue = column.getFilterValue() as [number, number]

  const [min, max] = columnFilterValue ?? [0, 0]

  return (
    <div className="flex w-32 gap-2">
      <NumberInput
        controlProps={{hidden: true}}
        min={0}
        onValueChange={({valueAsNumber}) =>
          column.setFilterValue((old: [number, number]) => [
            valueAsNumber,
            old?.[1],
          ])
        }
        placeholder="Min"
        size="sm"
        value={min ? `${min}` : ""}
      />
      <NumberInput
        controlProps={{hidden: true}}
        max={130}
        onValueChange={({valueAsNumber}) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            valueAsNumber,
          ])
        }
        placeholder="Max"
        size="sm"
        value={max ? `${max}` : ""}
      />
    </div>
  )
}
