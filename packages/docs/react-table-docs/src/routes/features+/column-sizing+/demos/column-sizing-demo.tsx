import {useMemo, useState} from "react"

import {
  type ColumnResizeDirection,
  type ColumnResizeMode,
  getCoreRowModel,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"

import {columns, useUserData} from "./use-data"

export function ColumnSizingDemo() {
  const {data = [], refetch} = useUserData(5)

  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange")

  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>("ltr")

  const table = useReactTable({
    columnResizeDirection,
    columnResizeMode,
    columns,
    data: useMemo(() => data, [data]),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root showColumnDivider>
        <Table.ActionBar className="gap-8">
          <Button onClick={() => refetch()} variant="outline">
            Regenerate
          </Button>

          <RadioGroup
            label="Resize"
            onValueChange={(value) =>
              setColumnResizeMode(value as ColumnResizeMode)
            }
            orientation="horizontal"
            value={columnResizeMode}
          >
            <Radio label="onChange" value="onChange" />
            <Radio label="onEnd" value="onEnd" />
          </RadioGroup>

          <RadioGroup
            label="Direction"
            onValueChange={(value) =>
              setColumnResizeDirection(value as ColumnResizeDirection)
            }
            orientation="horizontal"
            value={columnResizeDirection}
          >
            <Radio label="ltr" value="ltr" />
            <Radio label="rtl" value="rtl" />
          </RadioGroup>
        </Table.ActionBar>

        <Table.ScrollContainer>
          <Table.Table
            dir={table.options.columnResizeDirection}
            style={{width: table.getCenterTotalSize()}}
          >
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeaderCell
                      key={header.id}
                      className="relative text-justify"
                      colSpan={header.colSpan}
                      style={{width: header.getSize()}}
                    >
                      <div className="inline-flex w-full items-center justify-between gap-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                        <Table.ColumnResizeHandle header={header} />
                      </div>
                    </Table.HeaderCell>
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
                      style={{
                        width: cell.column.getSize(),
                      }}
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
        className="w-full"
        code={JSON.stringify(
          {
            columnSizing: table.getState().columnSizing,
            columnSizingInfo: table.getState().columnSizingInfo,
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
