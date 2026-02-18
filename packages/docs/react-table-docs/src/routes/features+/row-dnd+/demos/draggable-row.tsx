import {useSortable} from "@dnd-kit/sortable"

import type {Row} from "@qualcomm-ui/core/table"
import {flexRender, Table} from "@qualcomm-ui/react/table"

import type {VerticalEdge} from "~utils/dnd"

import type {User} from "./use-data"

interface DraggableRowProps {
  closestEdge: VerticalEdge | undefined
  isOver: boolean
  row: Row<User>
  sourceIndex: number | null
}

export function DraggableRow({
  closestEdge,
  isOver,
  row,
  sourceIndex,
}: DraggableRowProps) {
  const {attributes, isDragging, listeners, setNodeRef} = useSortable({
    id: row.id,
  })

  return (
    <Table.Row
      ref={setNodeRef}
      data-row-index={row.index}
      isDragging={isDragging}
      isDraggingOver={isOver}
    >
      <Table.Cell className="p-2">
        <Table.RowDragHandle {...listeners} {...attributes} />
        {isOver && sourceIndex !== null ? (
          <Table.RowDropIndicator
            closestEdge={closestEdge}
            rowIndex={row.index}
            sourceIndex={sourceIndex}
          />
        ) : null}
      </Table.Cell>
      {row.getVisibleCells().map((cell) => (
        <Table.Cell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}
