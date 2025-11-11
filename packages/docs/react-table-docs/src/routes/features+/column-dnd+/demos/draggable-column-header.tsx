import {useEffect, useEffectEvent, useRef, useState} from "react"

import {combine} from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {pointerOutsideOfPreview} from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import {setCustomNativeDragPreview} from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"

import type {DragState} from "@qualcomm-ui/core/dnd"
import type {Header, TableInstance} from "@qualcomm-ui/core/table"
import {flexRender, Table} from "@qualcomm-ui/react/table"
import {arrayMove} from "@qualcomm-ui/utils/array"

import type {User} from "./use-data"

interface DraggableColumnHeaderProps {
  header: Header<User, unknown>
  table: TableInstance<User>
}

const idleState: DragState = {type: "idle"}

export function DraggableColumnHeader({
  header,
  table,
}: DraggableColumnHeaderProps) {
  const {getState, setColumnOrder} = table
  const {columnOrder} = getState()
  const {column} = header
  const elementRef = useRef<HTMLTableCellElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [state, setState] = useState<DragState>(idleState)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const reorderColumn = useEffectEvent(
    (
      draggedColumnId: string,
      targetColumnId: string,
      closestEdge: Edge | null,
    ) => {
      const sourceIndex = columnOrder.indexOf(draggedColumnId)
      let targetIndex = columnOrder.indexOf(targetColumnId)

      if (closestEdge === "left" && sourceIndex < targetIndex) {
        // going right, but column indicator is at the left of the row
        targetIndex--
      } else if (closestEdge === "right" && sourceIndex > targetIndex) {
        // going left, but column indicator is at the left of the row
        targetIndex++
      }

      if (sourceIndex !== targetIndex) {
        return setColumnOrder(arrayMove(columnOrder, sourceIndex, targetIndex))
      }
    },
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }
    return combine(
      draggable({
        dragHandle: dragHandleRef.current!,
        element,
        getInitialData() {
          return {columnId: column.id}
        },
        onDragStart() {
          setIsDragging(true)
          setState({type: "is-dragging"})
        },
        onDrop(payload) {
          const data = payload.location.current.dropTargets[0]?.data ?? {}
          const targetId = data.columnId as string
          reorderColumn(column.id, targetId, extractClosestEdge(data))
          setIsDragging(false)
          setState(idleState)
        },
        onGenerateDragPreview({nativeSetDragImage}) {
          setCustomNativeDragPreview({
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            nativeSetDragImage,
            render({container}) {
              setState({container, type: "preview"})
              return () => setState(idleState)
            },
          })
        },
      }),
      dropTargetForElements({
        canDrop({element: targetElement}) {
          return targetElement.hasAttribute("data-column-id")
        },
        element,
        getData({input}) {
          const data = {columnId: column.id}
          return attachClosestEdge(data, {
            allowedEdges: ["left", "right"],
            element,
            input,
          })
        },
        getIsSticky() {
          return true
        },
        onDrag({self, source}) {
          const closestEdge = extractClosestEdge(self.data)

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current
            }
            return {
              closestEdge,
              sourceIndex: columnOrder.indexOf(source.data?.columnId as string),
              type: "is-dragging-over",
            }
          })
        },
        onDragEnter({self, source}) {
          const closestEdge = extractClosestEdge(self.data)
          setState({
            closestEdge,
            sourceIndex: columnOrder.indexOf(source.data?.columnId as string),
            type: "is-dragging-over",
          })
        },
        onDragLeave() {
          setState(idleState)
        },
        onDrop() {
          setState(idleState)
        },
      }),
    )
  }, [column.id, columnOrder])

  return (
    <>
      <Table.HeaderCell
        ref={elementRef}
        className="whitespace-nowrap"
        colSpan={header.colSpan}
        columnIndex={columnOrder.indexOf(column.id)}
        data-column-id={column.id}
        isDragging={isDragging}
        isDraggingOver={state.type === "is-dragging-over"}
        style={{width: header.column.getSize()}}
      >
        <div className="flex items-center gap-4">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          <Table.ColumnDragHandle ref={dragHandleRef} />

          {state.type === "is-dragging-over" ? (
            <Table.ColumnDropIndicator
              closestEdge={state.closestEdge}
              columnIndex={columnOrder.indexOf(column.id)}
              sourceColumnIndex={state.sourceIndex}
            />
          ) : null}
        </div>
      </Table.HeaderCell>

      {state.type === "preview" ? (
        <Table.ColumnDragPreview container={state.container} header={header} />
      ) : null}
    </>
  )
}
