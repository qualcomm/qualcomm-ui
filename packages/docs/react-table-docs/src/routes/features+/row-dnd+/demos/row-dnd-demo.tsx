import {useEffect, useState} from "react"

import {getCoreRowModel} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {RenderHeader, Table, useReactTable} from "@qualcomm-ui/react/table"
import {arrayMove} from "@qualcomm-ui/utils/array"

import {DraggableRow} from "./draggable-row"
import {type User, userColumns, useUserData} from "./use-data"

export function RowDndDemo() {
  const {data = [], isFetching, refetch} = useUserData(10)

  const [mutableData, setMutableData] = useState<User[]>(data)

  useEffect(() => {
    setMutableData(data)
  }, [data])

  function reorderRow(sourceRowIndex: number, targetRowIndex: number) {
    setMutableData(arrayMove(mutableData, sourceRowIndex, targetRowIndex))
  }

  const regenerateData = () => refetch()

  const table = useReactTable({
    columns: userColumns,
    data: mutableData,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.userId,
  })

  return (
    <Table.Root>
      <Table.ActionBar>
        <Button onClick={regenerateData} variant="outline">
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
            {table.getRowModel().rows.map((row) => (
              <DraggableRow key={row.id} reorderRow={reorderRow} row={row} />
            ))}
          </Table.Body>
        </Table.Table>
      </Table.ScrollContainer>
    </Table.Root>
  )
}
