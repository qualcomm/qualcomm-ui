import {useId, useMemo, useState} from "react"

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
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable"

import {
  type ColumnDef,
  type ColumnOrderState,
  getCoreRowModel,
  type Header,
} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {arrayMove} from "@qualcomm-ui/utils/array"

import {useClosestEdge} from "~utils/dnd"

import {DraggableColumnHeader} from "./draggable-column-header"
import {type User, useUserData} from "./use-data"

export function ColumnDndDemo() {
  const {data = [], isFetching, refetch} = useUserData(10)
  const dndId = useId()
  const sensors = useSensors(useSensor(PointerSensor))

  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const {
    calculateEdge,
    closestEdge,
    reset: resetEdge,
  } = useClosestEdge("horizontal")

  const userColumns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
        minSize: 180,
      },
      {
        accessorKey: "averageSessionDuration",
        header: "Avg Session Duration",
        id: "averageSessionDuration",
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
        id: "companyName",
        minSize: 220,
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

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    userColumns.map((column) => column.id as string),
  )

  const table = useReactTable({
    columns: userColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    state: {columnOrder},
  })

  const headers = table.getHeaderGroups()[0]?.headers ?? []
  const activeHeader: Header<User, unknown> | null = activeId
    ? (headers.find((h) => h.column.id === activeId) ?? null)
    : null

  function handleDragOver({active, over}: DragOverEvent) {
    setOverId((over?.id as string) ?? null)
    calculateEdge(active, over)
  }

  function handleDragMove({active, over}: DragMoveEvent) {
    calculateEdge(active, over)
  }

  function handleDragEnd({active, over}: DragEndEvent) {
    if (over && active.id !== over.id && closestEdge) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        let newIndex = items.indexOf(over.id as string)
        if (closestEdge === "left" && oldIndex < newIndex) {
          newIndex--
        } else if (closestEdge === "right" && oldIndex > newIndex) {
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
    <div className="flex w-full flex-col gap-4 p-2">
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
            <Button
              onClick={() =>
                setColumnOrder(userColumns.map((c) => c.id as string))
              }
              variant="outline"
            >
              Reset Order
            </Button>
            {isFetching ? <ProgressRing size="xs" /> : null}
          </Table.ActionBar>
          <Table.ScrollContainer>
            <Table.Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableColumnHeader
                          key={header.id}
                          closestEdge={
                            overId === header.column.id
                              ? closestEdge
                              : undefined
                          }
                          columnOrder={columnOrder}
                          header={header}
                          isOver={
                            overId === header.column.id &&
                            activeId !== header.column.id
                          }
                          sourceColumnIndex={
                            activeId ? columnOrder.indexOf(activeId) : null
                          }
                        />
                      ))}
                    </SortableContext>
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        style={{minWidth: cell.column.columnDef.minSize}}
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
        <DragOverlay>
          {activeHeader ? (
            <Table.ColumnDragPreview header={activeHeader} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CodeHighlight
        className="w-fit"
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
