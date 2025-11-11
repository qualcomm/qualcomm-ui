import {useState} from "react"

import {faker} from "@faker-js/faker"

import {
  type ColumnOrderState,
  getCoreRowModel,
  type VisibilityState,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {PinnableHeader} from "./pinnable-header"
import {userColumns, useUserData} from "./use-data"

export default function ColumnPinningDemo() {
  const {data = [], isFetching, refetch} = useUserData(15)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [columnPinning, setColumnPinning] = useState({})

  const [isSplit, setIsSplit] = useState(false)
  const rerender = () => refetch()

  const table = useReactTable({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnOrder,
      columnPinning,
      columnVisibility,
    },
  })

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={rerender} variant="outline">
          Regenerate
        </Button>
        <Button onClick={randomizeColumns} variant="outline">
          Shuffle Columns
        </Button>
        {isFetching ? <ProgressRing size="xs" /> : null}
      </div>

      <div className="mt-4">
        <Checkbox
          checked={isSplit}
          label="Split pinned columns into multiple tables"
          onCheckedChange={setIsSplit}
          size="sm"
        />
      </div>

      <div className={clsx("flex", {"gap-4": isSplit})}>
        {isSplit && table.getIsSomeColumnsPinned("left") ? (
          <Table.Root showColumnDivider>
            <Table.Table>
              <Table.Header>
                {table.getLeftHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <PinnableHeader key={header.id} header={header} />
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Table.Row key={row.id}>
                      {row.getLeftVisibleCells().map((cell) => {
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
          </Table.Root>
        ) : null}

        {(isSplit && table.getCenterFlatHeaders().length) || !isSplit ? (
          <Table.Root showColumnDivider>
            <Table.Table>
              <Table.Header>
                {(isSplit
                  ? table.getCenterHeaderGroups()
                  : table.getHeaderGroups()
                ).map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <PinnableHeader key={header.id} header={header} />
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Table.Row key={row.id}>
                      {(isSplit
                        ? row.getCenterVisibleCells()
                        : row.getVisibleCells()
                      ).map((cell) => {
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
          </Table.Root>
        ) : null}

        {isSplit && table.getIsSomeColumnsPinned("right") ? (
          <Table.Root showColumnDivider>
            <Table.Table>
              <Table.Header>
                {table.getRightHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <PinnableHeader key={header.id} header={header} />
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Table.Row key={row.id}>
                      {row.getRightVisibleCells().map((cell) => {
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
          </Table.Root>
        ) : null}
      </div>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {columnPinning: table.getState().columnPinning},
          null,
          2,
        )}
        disableCopy
        language="json"
      />
    </div>
  )
}
