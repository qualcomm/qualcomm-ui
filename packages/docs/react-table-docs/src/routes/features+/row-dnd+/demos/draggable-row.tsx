import {useEffect, useRef, useState} from "react"

import {combine} from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {pointerOutsideOfPreview} from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import {setCustomNativeDragPreview} from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"

import type {DragState} from "@qualcomm-ui/core/dnd"
import type {Row} from "@qualcomm-ui/core/table"
import {flexRender, Table} from "@qualcomm-ui/react/table"

import type {User} from "./use-data"

interface Props {
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void
  row: Row<User>
}

const idleState: DragState = {type: "idle"}

export function DraggableRow({reorderRow, row}: Props) {
  const elementRef = useRef<HTMLTableRowElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [state, setState] = useState<DragState>(idleState)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }
    return combine(
      draggable({
        dragHandle: dragHandleRef.current!,
        element,
        getInitialData(): {rowIndex: number} {
          return {rowIndex: row.index}
        },
        onDragStart() {
          setIsDragging(true)
          setState({type: "is-dragging"})
        },
        onDrop(payload) {
          const data = payload.location.current.dropTargets[0]?.data ?? {}
          const targetIndex = data.rowIndex
          const closestEdge = data?.closestEdge

          if (typeof targetIndex === "number" && targetIndex !== row.index) {
            if (closestEdge === "bottom" && row.index > targetIndex) {
              // going up, but row indicator is at the bottom of the row
              reorderRow(row.index, targetIndex - 1)
            } else if (closestEdge === "top" && row.index < targetIndex) {
              // going down, but row indicator is at the top of the row
              reorderRow(row.index, targetIndex + 1)
            } else {
              reorderRow(row.index, targetIndex)
            }
          }
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
          return targetElement.hasAttribute("data-row-index")
        },
        element,
        getData({input}) {
          const data = {rowIndex: row.index}
          return attachClosestEdge(data, {
            allowedEdges: ["top", "bottom"],
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
              sourceIndex: source.data?.rowIndex as number,
              type: "is-dragging-over",
            }
          })
        },
        onDragEnter({self, source}) {
          const closestEdge = extractClosestEdge(self.data)
          setState({
            closestEdge,
            sourceIndex: source.data?.rowIndex as number,
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
  }, [reorderRow, row.index])

  return (
    <>
      <Table.Row
        ref={elementRef}
        data-row-index={row.index}
        isDragging={isDragging}
        isDraggingOver={state.type === "is-dragging-over"}
      >
        <Table.Cell className="p-2">
          <Table.RowDragHandle ref={dragHandleRef} />
          {state.type === "is-dragging-over" ? (
            <Table.RowDropIndicator
              closestEdge={state.closestEdge}
              rowIndex={row.index}
              sourceIndex={state.sourceIndex}
            />
          ) : null}
        </Table.Cell>
        {row.getVisibleCells().map((cell) => (
          <Table.Cell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Table.Cell>
        ))}
      </Table.Row>

      {state.type === "preview" ? (
        <Table.RowDragPreview container={state.container} row={row} />
      ) : null}
    </>
  )
}
