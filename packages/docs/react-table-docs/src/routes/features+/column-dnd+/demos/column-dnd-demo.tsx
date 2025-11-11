import {useState} from "react"

import {type ColumnOrderState, getCoreRowModel} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

import {DraggableColumnHeader} from "./draggable-column-header"
import {userColumns, useUserData} from "./use-data"

export default function ColumnDndDemo() {
  const {data = [], isFetching, refetch} = useUserData(10)

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    userColumns.map((column) => column.id as string), // must start out with populated columnOrder so we can splice
  )

  const regenerateData = () => refetch()

  const resetOrder = () =>
    setColumnOrder(userColumns.map((column) => column.id as string))

  const table = useReactTable({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    state: {
      columnOrder,
    },
  })

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <Button onClick={regenerateData} variant="outline">
            Regenerate
          </Button>
          <Button onClick={resetOrder} variant="outline">
            Reset Order
          </Button>
          {isFetching ? <ProgressRing size="xs" /> : null}
        </Table.ActionBar>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DraggableColumnHeader
                      key={header.id}
                      header={header}
                      table={table}
                    />
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      style={{minWidth: cell.column.columnDef.minSize}}
                    >
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
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {columnOrder: table.getState().columnOrder},
          null,
          2,
        )}
        disableCopy
        language="json"
      />
    </div>
  )
}
