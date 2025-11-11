import {useMemo, useState} from "react"

import {getCoreRowModel} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

import {userColumns, useUserData} from "./use-data"

export default function ColumnVisibilityDemo() {
  const {data = []} = useUserData(5)

  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    columns: userColumns,
    data: useMemo(() => data, [data]),
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <div className="flex gap-4">
        <div className="border-neutral-01 inline-flex flex-col gap-1 rounded border p-2">
          <Checkbox
            checked={table.getIsAllColumnsVisible()}
            label={<span className="q-body-s strong">Toggle All</span>}
            onCheckedChange={(checked) =>
              table.toggleAllColumnsVisible(checked)
            }
            size="sm"
          />

          {table.getAllLeafColumns().map((column) => {
            return (
              <Checkbox
                key={column.id}
                checked={column.getIsVisible()}
                label={column.id}
                onCheckedChange={(checked) => column.toggleVisibility(checked)}
                size="sm"
              />
            )
          })}
        </div>
        <CodeHighlight
          className="w-fit"
          code={JSON.stringify(
            {columnVisibility: table.getState().columnVisibility},
            null,
            2,
          )}
          disableCopy
          language="json"
        />
      </div>
      <Table.Root>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeaderCell key={header.id} colSpan={header.colSpan}>
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
      </Table.Root>
    </div>
  )
}
