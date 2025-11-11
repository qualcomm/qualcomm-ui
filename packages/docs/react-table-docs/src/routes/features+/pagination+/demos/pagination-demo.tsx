import {useMemo} from "react"

import {
  type Column,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type TableInstance,
} from "@qualcomm-ui/core/table"
import {ActionGroup} from "@qualcomm-ui/react/action-group"
import {Button} from "@qualcomm-ui/react/button"
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

export default function PaginationDemo() {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
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
    [],
  )

  const {data = [], isFetching, refetch} = useUserData(10000)

  const regenerateData = () => refetch()

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4">
      <Table.Root>
        <Table.ActionBar>
          <Button onClick={regenerateData} variant="outline">
            Regenerate
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
                            <div className="inline-flex items-center justify-center">
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
          <ActionGroup>
            <Pagination.PageButtons />
            <Pagination.PageSize options={[10, 20, 50, 100]}>
              <Pagination.PageSizeLabel>Page size</Pagination.PageSizeLabel>
            </Pagination.PageSize>
          </ActionGroup>
        </Table.Pagination>
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {pagination: table.getState().pagination},
          null,
          2,
        )}
        disableCopy
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
