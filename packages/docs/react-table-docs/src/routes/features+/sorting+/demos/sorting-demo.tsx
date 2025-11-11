import {useState} from "react"

import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

import {userColumns, useUserData} from "./use-data"

export default function SortingDemo() {
  const [sorting, setSorting] = useState<SortingState>([])

  const {data = [], isFetching, refetch} = useUserData(20)
  const refreshData = () => refetch()

  const table = useReactTable({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    sortDescFirst: true,
    state: {
      sorting,
    },
  })

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
                    if (header.isPlaceholder) {
                      return (
                        <Table.HeaderCell
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{width: header.getSize()}}
                        />
                      )
                    }
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{width: header.getSize()}}
                      >
                        <div className="inline-flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <Table.ColumnSortAction header={header} />
                        </div>
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
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify({sorting: table.getState().sorting}, null, 2)}
        disableCopy
        language="json"
      />
    </div>
  )
}
