import {useState} from "react"

import {ChevronDown, ChevronRight} from "lucide-react"

import {
  type Column,
  type ColumnDef,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type TableInstance,
} from "@qualcomm-ui/core/table"
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
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"

import {type User, useUserData} from "./use-data"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    cell: ({getValue, row}) => {
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
              indeterminate={indeterminate}
              onCheckedChange={(nextState) => row.toggleSelected(nextState)}
              size="sm"
            />
            {row.getCanExpand() ? (
              <div className="inline-flex items-center justify-center">
                <Table.RowExpandButton row={row} />
              </div>
            ) : null}
            <span>{getValue() as string}</span>
          </>
        </div>
      )
    },
    header: ({table}) => {
      return (
        <>
          <div className="flex items-center gap-2">
            <Table.ColumnHeaderAction
              icon={table.getIsAllRowsExpanded() ? ChevronDown : ChevronRight}
              onClick={table.getToggleAllRowsExpandedHandler()}
            />
            <span>Username</span>
          </div>
        </>
      )
    },
    id: "username",
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
    minSize: 200,
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
]

export default function RowExpansionDemo() {
  const {data = [], isFetching, refetch} = useUserData(100, 5, 3)
  const refreshData = () => refetch()

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    columns,
    data,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSubRows: (row) => row.subRows,
    onExpandedChange: setExpanded,
    state: {
      expanded,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4 p-2">
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
                            <div
                              className="inline-flex items-center justify-center"
                              style={{
                                minHeight: header.column.getCanFilter()
                                  ? 28
                                  : "auto",
                              }}
                            >
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

      <CodeHighlight
        className="max-h-[400px] overflow-y-auto"
        code={JSON.stringify(
          {expanded, rowSelection: table.getState().rowSelection},
          null,
          2,
        )}
        language="json"
      />
    </div>
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
