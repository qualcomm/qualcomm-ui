import {useMemo} from "react"

import {
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  getCoreRowModel,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {makeGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

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

interface ColumnOrderingExampleProps {
  onColumnOrderChange?: (order: ColumnOrderState) => void
}

function ColumnOrderingExample({
  onColumnOrderChange,
}: ColumnOrderingExampleProps) {
  const data = useMemo(makeGuideUsers, [])
  const [columnOrder, setColumnOrder] = useControlledState<ColumnOrderState>(
    ["name", "team", "role"],
    onColumnOrderChange,
  )
  const [columnPinning, setColumnPinning] = useControlledState<ColumnPinningState>(
    {left: [], right: []},
  )
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    state: {columnOrder, columnPinning},
  })

  return (
    <>
      <button
        onClick={() => table.setColumnOrder(["role", "name", "team"])}
        type="button"
      >
        Move Role first
      </button>
      <button
        onClick={() => table.getColumn("name")?.pin("left")}
        type="button"
      >
        Pin Name left
      </button>
      <output aria-live="polite">
        {`Visible columns: ${[
          ...table.getLeftVisibleLeafColumns(),
          ...table.getCenterVisibleLeafColumns(),
          ...table.getRightVisibleLeafColumns(),
        ]
          .map((column) => column.id)
          .join(", ")}`}
      </output>
      <GuideTable label="Column ordering" table={table} />
    </>
  )
}

describe("Column Ordering Guide", () => {
  test("updates the rendered column sequence from controlled order state", async () => {
    const onColumnOrderChange = vi.fn()

    await render(
      <ColumnOrderingExample onColumnOrderChange={onColumnOrderChange} />,
    )

    await page.getByRole("button", {name: "Move Role first"}).click()

    await expect.poll(() => onColumnOrderChange).toHaveBeenLastCalledWith([
      "role",
      "name",
      "team",
    ])
    await expect
      .element(page.getByText("Visible columns: role, name, team"))
      .toBeVisible()
  })

  test("keeps pinned columns ahead of manually ordered center columns", async () => {
    await render(<ColumnOrderingExample />)

    await page.getByRole("button", {name: "Pin Name left"}).click()
    await page.getByRole("button", {name: "Move Role first"}).click()

    await expect
      .element(page.getByText("Visible columns: name, role, team"))
      .toBeVisible()
  })
})
