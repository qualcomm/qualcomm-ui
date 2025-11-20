import {useCallback, useEffect, useRef, useState} from "react"

import {
  type CellContext,
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  type RowData,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TextInput} from "@qualcomm-ui/react/text-input"

import {type User, userColumns, useUserData} from "./use-data"

// Extend the table row meta to provide a TypeScript type for our custom function.
declare module "@qualcomm-ui/core/table" {
  interface TableMeta<_TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

function Cell({
  column: {id},
  getValue,
  row: {index},
  table,
}: CellContext<User, unknown>) {
  const initialValue = getValue()
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <TextInput
      className="w-full"
      clearable={false}
      onBlur={onBlur}
      onValueChange={setValue}
      size="sm"
      value={value as string}
    />
  )
}

const defaultColumn: Partial<ColumnDef<User>> = {
  cell: Cell,
}

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

export function EditableDataDemo() {
  const {data: userData = [], isFetching, refetch} = useUserData(1000)

  const [mutableData, setMutableData] = useState<User[]>(userData)

  useEffect(() => {
    setMutableData(userData)
  }, [userData])

  const refreshData = () => refetch()

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const table = useReactTable({
    autoResetPageIndex,
    columns: userColumns,
    data: mutableData,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex()
        setMutableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          }),
        )
      },
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
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
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
          <Pagination.PageButtons />
        </Table.Pagination>
      </Table.Root>
    </div>
  )
}
