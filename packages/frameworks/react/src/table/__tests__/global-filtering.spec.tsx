import {useMemo} from "react"

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
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
    accessorKey: "internalCode",
    cell: (info) => String(info.getValue()),
    enableGlobalFilter: false,
    header: "Internal code",
    id: "internalCode",
  },
]

interface GlobalFilteringExampleProps {
  manual?: boolean
  onGlobalFilterChange?: (value: string) => void
}

function GlobalFilteringExample({
  manual = false,
  onGlobalFilterChange,
}: GlobalFilteringExampleProps) {
  const data = useMemo(makeGuideUsers, [])
  const [globalFilter, setGlobalFilter] = useControlledState(
    "",
    onGlobalFilterChange,
  )
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manual ? undefined : getFilteredRowModel(),
    manualFiltering: manual,
    onGlobalFilterChange: setGlobalFilter,
    state: {globalFilter},
  })

  return (
    <>
      <label>
        Search users
        <input
          onChange={(event) => table.setGlobalFilter(event.currentTarget.value)}
          value={globalFilter}
        />
      </label>
      <GuideTable label="Global filtering" table={table} />
    </>
  )
}

describe("Global Filtering Guide", () => {
  test("finds values across globally enabled columns", async () => {
    await render(<GlobalFilteringExample />)

    await userEvent.type(page.getByLabelText("Search users"), "Platform")

    await expect.element(page.getByText("Ada Lovelace")).toBeVisible()
    await expect.element(page.getByText("Alice Johnson")).toBeVisible()
    await expect.element(page.getByText("Margaret Hamilton")).toBeVisible()
    await expect.element(page.getByText("Grace Hopper")).not.toBeInTheDocument()
  })

  test("does not search a column that disables global filtering", async () => {
    await render(<GlobalFilteringExample />)

    await userEvent.type(page.getByLabelText("Search users"), "Q-101")

    await expect.element(page.getByText("Ada Lovelace")).not.toBeInTheDocument()
    await expect.element(page.getByText("Grace Hopper")).not.toBeInTheDocument()
  })

  test("publishes global filter state without locally filtering manual data", async () => {
    const onGlobalFilterChange = vi.fn()

    await render(
      <GlobalFilteringExample
        manual
        onGlobalFilterChange={onGlobalFilterChange}
      />,
    )

    await userEvent.type(page.getByLabelText("Search users"), "Platform")

    await expect.poll(() => onGlobalFilterChange).toHaveBeenLastCalledWith(
      "Platform",
    )
    await expect.element(page.getByText("Grace Hopper")).toBeVisible()
  })
})
