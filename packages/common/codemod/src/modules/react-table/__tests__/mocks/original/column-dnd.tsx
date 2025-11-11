// @ts-nocheck
"use client"

import {FC, useState} from "react"

import {GripVertical} from "lucide-react"
import {useDrag, useDrop} from "react-dnd"

import {CodeHighlight} from "@qui/mdx-docs"
import {QButton, QIconButton, QProgressCircle} from "@qui/react"
import {
  Column,
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  Header,
  QTable,
  QTbody,
  QTd,
  QTh,
  QThead,
  QTr,
  Table,
  useReactTable,
} from "@qui/react-table"

import {Person, usePersonData} from "~utils/data"

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    id: "firstName",
  },
  {
    accessorFn: (row) => row.lastName,
    header: "Last Name",
    id: "lastName",
  },
  {
    accessorKey: "age",
    header: "Age",
    id: "age",
  },
  {
    accessorKey: "visits",
    header: "Visits",
    id: "visits",
  },
  {
    accessorKey: "status",
    header: "Status",
    id: "status",
  },
  {
    accessorKey: "progress",
    header: "Profile Progress",
    id: "progress",
  },
]

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[],
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
  )
  return [...columnOrder]
}

const DraggableColumnHeader: FC<{
  header: Header<Person, unknown>
  table: Table<Person>
}> = ({header, table}) => {
  const {getState, setColumnOrder} = table
  const {columnOrder} = getState()
  const {column} = header

  const [{isOver}, dropRef] = useDrop({
    accept: "column",
    collect: (monitor) => {
      return {
        isOver: monitor.isOver({shallow: true}),
      }
    },
    drop: (draggedColumn: Column<Person>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder,
      )
      setColumnOrder(newColumnOrder)
    },
  })

  const [{isDragging}, dragRef, previewRef] = useDrag({
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
    item: () => column,
    type: "column",
  })

  return (
    <QTh
      ref={dropRef as any}
      className="whitespace-nowrap"
      colSpan={header.colSpan}
      isDragging={isDragging}
      isDraggingOver={isOver}
      style={{width: header.column.getSize()}}
    >
      <div ref={previewRef as any} className="inline-flex items-center gap-1">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <QIconButton ref={dragRef as any} dense icon={GripVertical} size="s" />
      </div>
    </QTh>
  )
}

export default function ColumnDndTable() {
  const {data = [], isFetching, refetch} = usePersonData(20)

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => column.id as string), // must start out with populated columnOrder so we can splice
  )

  const regenerateData = () => refetch()

  const resetOrder = () =>
    setColumnOrder(columns.map((column) => column.id as string))

  const table = useReactTable({
    columns,
    data,
    debugAll: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    state: {
      columnOrder,
    },
  })

  return (
    <div className="overflow-x-auto p-2">
      <div className="flex flex-wrap items-center gap-2">
        <QButton onClick={regenerateData} variant="outline">
          Regenerate
        </QButton>
        <QButton onClick={resetOrder} variant="outline">
          Reset Order
        </QButton>
        {isFetching ? <QProgressCircle size="xs" /> : null}
      </div>

      <QTable className="mt-4">
        <QThead>
          {table.getHeaderGroups().map((headerGroup) => (
            <QTr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DraggableColumnHeader
                  key={header.id}
                  header={header}
                  table={table}
                />
              ))}
            </QTr>
          ))}
        </QThead>
        <QTbody>
          {table.getRowModel().rows.map((row) => (
            <QTr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <QTd key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </QTd>
              ))}
            </QTr>
          ))}
        </QTbody>
      </QTable>

      <CodeHighlight
        className="mt-4 w-fit"
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
