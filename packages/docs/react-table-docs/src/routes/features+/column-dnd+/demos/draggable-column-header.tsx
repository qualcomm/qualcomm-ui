import {useSortable} from "@dnd-kit/sortable"

import type {ColumnOrderState, Header} from "@qualcomm-ui/core/table"
import {flexRender, Table} from "@qualcomm-ui/react/table"

import type {HorizontalEdge} from "~utils/dnd"

import type {User} from "./use-data"

interface DraggableColumnHeaderProps {
  closestEdge: HorizontalEdge | undefined
  columnOrder: ColumnOrderState
  header: Header<User, unknown>
  isOver: boolean
  sourceColumnIndex: number | null
}

export function DraggableColumnHeader({
  closestEdge,
  columnOrder,
  header,
  isOver,
  sourceColumnIndex,
}: DraggableColumnHeaderProps) {
  const {column} = header
  const columnIndex = columnOrder.indexOf(column.id)

  const {attributes, isDragging, listeners, setNodeRef} = useSortable({
    id: column.id,
  })

  return (
    <Table.HeaderCell
      ref={setNodeRef}
      className="whitespace-nowrap"
      colSpan={header.colSpan}
      columnIndex={columnIndex}
      data-column-id={column.id}
      isDragging={isDragging}
      isDraggingOver={isOver}
      style={{width: header.column.getSize()}}
    >
      <div className="flex items-center gap-4">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <Table.ColumnDragHandle {...listeners} {...attributes} />

        {isOver && sourceColumnIndex !== null ? (
          <Table.ColumnDropIndicator
            closestEdge={closestEdge}
            columnIndex={columnIndex}
            sourceColumnIndex={sourceColumnIndex}
          />
        ) : null}
      </div>
    </Table.HeaderCell>
  )
}
