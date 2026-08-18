import {useMemo} from "react"

import {
  type Cell,
  type ColumnDef,
  type ColumnPinningState,
  getCoreRowModel,
  type HeaderGroup,
  type Row,
} from "@qualcomm-ui/core/table"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {makeGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"

const columns: ColumnDef<GuideUser>[] = [
  {
    accessorKey: "name",
    cell: (info) => String(info.getValue()),
    header: "Name",
    id: "name",
  },
  {
    accessorKey: "team",
    cell: (info) => String(info.getValue()),
    header: "Team",
    id: "team",
  },
  {
    accessorKey: "role",
    cell: (info) => String(info.getValue()),
    header: "Role",
    id: "role",
  },
]

interface PinnedTableProps {
  getCells: (row: Row<GuideUser>) => Cell<GuideUser>[]
  headerGroups: HeaderGroup<GuideUser>[]
  label: string
  rows: Row<GuideUser>[]
}

function PinnedTable({
  getCells,
  headerGroups,
  label,
  rows,
}: PinnedTableProps) {
  return (
    <Table.Root>
      <Table.ScrollContainer>
        <Table.Table>
          <caption>{label}</caption>
          <Table.Header>
            {headerGroups.map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.HeaderCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id}>
                {getCells(row).map((cell) => (
                  <Table.Cell key={cell.id} cell={cell}>
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
  )
}

interface ColumnPinningExampleProps {
  onColumnPinningChange?: (state: ColumnPinningState) => void
}

function ColumnPinningExample({
  onColumnPinningChange,
}: ColumnPinningExampleProps) {
  const data = useMemo(makeGuideUsers, [])
  const [columnPinning, setColumnPinning] = useControlledState<ColumnPinningState>(
    {left: [], right: []},
    onColumnPinningChange,
  )
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnPinningChange: setColumnPinning,
    state: {columnPinning},
  })
  const rows = table.getRowModel().rows

  return (
    <>
      <button
        onClick={() => table.getColumn("name")?.pin("left")}
        type="button"
      >
        Pin Name left
      </button>
      <button
        onClick={() => table.getColumn("role")?.pin("right")}
        type="button"
      >
        Pin Role right
      </button>
      <button
        onClick={() => table.getColumn("name")?.pin(false)}
        type="button"
      >
        Unpin Name
      </button>
      {table.getIsSomeColumnsPinned("left") ? (
        <PinnedTable
          getCells={(row) => row.getLeftVisibleCells()}
          headerGroups={table.getLeftHeaderGroups()}
          label="Left pinned columns"
          rows={rows}
        />
      ) : null}
      <PinnedTable
        getCells={(row) => row.getCenterVisibleCells()}
        headerGroups={table.getCenterHeaderGroups()}
        label="Center columns"
        rows={rows}
      />
      {table.getIsSomeColumnsPinned("right") ? (
        <PinnedTable
          getCells={(row) => row.getRightVisibleCells()}
          headerGroups={table.getRightHeaderGroups()}
          label="Right pinned columns"
          rows={rows}
        />
      ) : null}
    </>
  )
}

describe("Column Pinning Guide", () => {
  test("pins a column to the left split table and publishes state", async () => {
    const onColumnPinningChange = vi.fn()

    await render(
      <ColumnPinningExample onColumnPinningChange={onColumnPinningChange} />,
    )

    await page.getByRole("button", {name: "Pin Name left"}).click()

    await expect.poll(() => onColumnPinningChange).toHaveBeenLastCalledWith({
      left: ["name"],
      right: [],
    })
    await expect
      .element(page.getByRole("table", {name: "Left pinned columns"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("table", {name: "Center columns"}))
      .toBeVisible()
  })

  test("pins to the right and returns an unpinned column to the center", async () => {
    await render(<ColumnPinningExample />)

    await page.getByRole("button", {name: "Pin Role right"}).click()

    await expect
      .element(page.getByRole("table", {name: "Right pinned columns"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Pin Name left"}).click()
    await page.getByRole("button", {name: "Unpin Name"}).click()

    await expect
      .element(page.getByRole("table", {name: "Left pinned columns"}))
      .not.toBeInTheDocument()
    await expect
      .element(
        page
          .getByRole("table", {name: "Center columns"})
          .getByText("Name"),
      )
      .toBeVisible()
  })
})
