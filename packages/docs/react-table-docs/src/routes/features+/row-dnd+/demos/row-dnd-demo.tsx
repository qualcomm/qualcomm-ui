import {useEffect, useId, useMemo, useState} from "react"

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"

import {type ColumnDef, getCoreRowModel} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {RenderHeader, Table, useReactTable} from "@qualcomm-ui/react/table"
import {arrayMove} from "@qualcomm-ui/utils/array"

import {useClosestEdge} from "~utils/dnd"

import {DraggableRow} from "./draggable-row"
import {type User, useUserData} from "./use-data"

export function RowDndDemo() {
  const {data = [], isFetching, refetch} = useUserData(10)
  const dndId = useId()
  const sensors = useSensors(useSensor(PointerSensor))

  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const {
    calculateEdge,
    closestEdge,
    reset: resetEdge,
  } = useClosestEdge("vertical")

  const userColumns: ColumnDef<User>[] = useMemo(
    () => [
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
        accessorKey: "createdAt",
        header: "Account Created On",
        id: "createdAt",
        minSize: 205,
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

  const [mutableData, setMutableData] = useState<User[]>(() => data as User[])

  useEffect(() => {
    setMutableData(data as User[])
  }, [data])

  const table = useReactTable({
    columns: userColumns,
    data: mutableData,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.userId,
  })

  const rows = table.getRowModel().rows
  const rowIds = rows.map((row) => row.id)
  const activeRow = activeId ? rows.find((row) => row.id === activeId) : null
  const sourceIndex = activeRow?.index ?? null

  function handleDragOver({active, over}: DragOverEvent) {
    setOverId((over?.id as string) ?? null)
    calculateEdge(active, over)
  }

  function handleDragMove({active, over}: DragMoveEvent) {
    calculateEdge(active, over)
  }

  function handleDragEnd({active, over}: DragEndEvent) {
    if (over && active.id !== over.id && closestEdge) {
      setMutableData((items) => {
        const oldIndex = items.findIndex((item) => item.userId === active.id)
        let newIndex = items.findIndex((item) => item.userId === over.id)
        if (closestEdge === "top" && oldIndex < newIndex) {
          newIndex--
        } else if (closestEdge === "bottom" && oldIndex > newIndex) {
          newIndex++
        }
        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setActiveId(null)
    setOverId(null)
    resetEdge()
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={dndId}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragStart={({active}) => setActiveId(active.id as string)}
      sensors={sensors}
    >
      <Table.Root>
        <Table.ActionBar>
          <Button onClick={() => void refetch()} variant="outline">
            Regenerate
          </Button>
          {isFetching ? <ProgressRing size="xs" /> : null}
        </Table.ActionBar>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  <Table.HeaderCell />
                  {headerGroup.headers.map((header) => (
                    <Table.HeaderCell
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{width: header.getSize()}}
                    >
                      <RenderHeader header={header} />
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              <SortableContext
                items={rowIds}
                strategy={verticalListSortingStrategy}
              >
                {rows.map((row) => (
                  <DraggableRow
                    key={row.id}
                    closestEdge={overId === row.id ? closestEdge : undefined}
                    isOver={overId === row.id && activeId !== row.id}
                    row={row}
                    sourceIndex={sourceIndex}
                  />
                ))}
              </SortableContext>
            </Table.Body>
          </Table.Table>
        </Table.ScrollContainer>
      </Table.Root>
      <DragOverlay>
        {activeRow ? <Table.RowDragPreview row={activeRow} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
