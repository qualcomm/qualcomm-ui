import {useEffect, useMemo, useRef, useState} from "react"

import {useVirtualizer} from "@tanstack/react-virtual"
import {ArrowDown} from "lucide-react"

import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
} from "@qualcomm-ui/core/table"
import {Icon} from "@qualcomm-ui/react/icon"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {makeUserData, type User} from "./make-data"

// This is a dynamic row height example, which is more complicated, but allows for a
// more realistic table.
export default function VirtualizedRowsDemo() {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
        size: 120,
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
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

  const [data, setData] = useState<User[]>([])

  useEffect(() => {
    setData(makeUserData(30000))
  }, [])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const {rows} = table.getRowModel()

  // The virtualizer needs to know the scrollable container element
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table
    // border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <div className="overflow-x-auto">
      ({data.length} rows)
      <div
        ref={tableContainerRef}
        className="relative mt-2 h-[800px] overflow-auto"
      >
        {/*
         * Even though we're still using semantic table tags, we must use
         * CSS grid and flexbox for dynamic row heights
         */}
        <Table.Root className="border-0">
          <Table.Table className="grid table-fixed border-1">
            <Table.Header className="bg-neutral-01 sticky top-0 z-10 grid">
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row
                  key={headerGroup.id}
                  className="border-neutral-01 flex w-full border-b"
                >
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
                    const sorted = header.column.getIsSorted()
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{width: header.getSize()}}
                      >
                        <div className="inline-flex h-full items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted ? (
                            <Icon
                              className={clsx(
                                "transition-[transform] ease-in-out",
                                {
                                  "rotate-180": sorted === "asc",
                                },
                              )}
                              icon={ArrowDown}
                              size="sm"
                            />
                          ) : null}
                        </div>
                      </Table.HeaderCell>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body
              className="relative grid"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <Table.Row
                    key={row.id}
                    ref={(node) => rowVirtualizer.measureElement(node)} // measure dynamic row height
                    className="absolute flex w-full border-l-[1px]"
                    data-index={virtualRow.index} // needed for dynamic row height measurement
                    style={{
                      borderColor: "var(--q-border-1-subtle)",
                      transform: `translateY(${virtualRow.start}px)`, // this should always be a `style` as it changes on scroll
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.Cell
                          key={cell.id}
                          className="flex items-center"
                          style={{
                            width: cell.column.getSize(),
                          }}
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
            </Table.Body>
          </Table.Table>
        </Table.Root>
      </div>
    </div>
  )
}
