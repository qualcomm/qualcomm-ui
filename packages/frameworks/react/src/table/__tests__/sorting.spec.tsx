import {useMemo} from "react"

import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@qualcomm-ui/core/table"
import {Table, useReactTable} from "@qualcomm-ui/react/table"
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
    accessorKey: "rank",
    cell: (info) => {
      const rank = info.getValue()
      return rank === undefined ? "Unranked" : String(rank)
    },
    header: "Rank",
    id: "rank",
    sortUndefined: -1,
  },
]

interface SortingExampleProps {
  manual?: boolean
  onSortingChange?: (sorting: SortingState) => void
}

function SortingExample({
  manual = false,
  onSortingChange,
}: SortingExampleProps) {
  const data = useMemo(() => makeGuideUsers().reverse(), [])
  const [sorting, setSorting] = useControlledState<SortingState>(
    [],
    onSortingChange,
  )
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manual ? undefined : getSortedRowModel(),
    manualSorting: manual,
    onSortingChange: setSorting,
    sortDescFirst: false,
    state: {sorting},
  })

  return (
    <>
      <output aria-live="polite">
        {`Visible users: ${table
          .getRowModel()
          .rows.map((row) => row.original.name)
          .join(", ")}`}
      </output>
      <GuideTable
        label="Sorting"
        renderHeaderAction={(header) => (
          <Table.ColumnSortAction
            aria-label={`Sort ${header.column.id}`}
            header={header}
          />
        )}
        table={table}
      />
    </>
  )
}

describe("Sorting Guide", () => {
  test("sorts rendered rows through the column sort action", async () => {
    await render(<SortingExample />)

    await page.getByRole("button", {name: "Sort name"}).click()

    await expect
      .element(
        page.getByText(
          /Visible users: Ada Lovelace, Alice Johnson, Alicia Stone/,
        ),
      )
      .toBeVisible()
  })

  test("adds a secondary sort when the user holds Shift", async () => {
    const onSortingChange = vi.fn()

    await render(<SortingExample onSortingChange={onSortingChange} />)

    await page.getByRole("button", {name: "Sort name"}).click()
    await page
      .getByRole("button", {name: "Sort team"})
      .click({modifiers: ["Shift"]})

    await expect.poll(() => onSortingChange).toHaveBeenLastCalledWith([
      {desc: false, id: "name"},
      {desc: false, id: "team"},
    ])
  })

  test("places undefined values first when configured", async () => {
    const onSortingChange = vi.fn()

    await render(<SortingExample onSortingChange={onSortingChange} />)

    await page.getByRole("button", {name: "Sort rank"}).click()

    await expect.poll(() => onSortingChange).toHaveBeenLastCalledWith([
      {desc: false, id: "rank"},
    ])
    await expect
      .element(page.getByText(/Visible users: Alice Johnson/))
      .toBeVisible()
  })

  test("publishes manual sorting state without locally reordering supplied rows", async () => {
    const onSortingChange = vi.fn()

    await render(<SortingExample manual onSortingChange={onSortingChange} />)

    await page.getByRole("button", {name: "Sort name"}).click()

    await expect.poll(() => onSortingChange).toHaveBeenLastCalledWith([
      {desc: false, id: "name"},
    ])
    await expect
      .element(page.getByText(/Visible users: Margaret Hamilton/))
      .toBeVisible()
  })
})
