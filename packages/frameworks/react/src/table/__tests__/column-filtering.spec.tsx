import {useMemo} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"

import {
  makeGuideUsers,
  makeHierarchicalGuideUsers,
  type GuideUser,
} from "./fixtures"
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
    accessorKey: "role",
    cell: (info) => String(info.getValue()),
    header: "Role",
    id: "role",
  },
  {
    accessorKey: "visits",
    cell: (info) => String(info.getValue()),
    filterFn: "inNumberRange",
    header: "Visits",
    id: "visits",
  },
]

interface FilteringExampleProps {
  manual?: boolean
  onFiltersChange?: (filters: ColumnFiltersState) => void
}

function FilteringExample({
  manual = false,
  onFiltersChange,
}: FilteringExampleProps) {
  const data = useMemo(() => makeGuideUsers(), [])
  const [columnFilters, setColumnFilters] =
    useControlledState<ColumnFiltersState>([], onFiltersChange)
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manual ? undefined : getFilteredRowModel(),
    manualFiltering: manual,
    onColumnFiltersChange: setColumnFilters,
    state: {columnFilters},
  })
  const visitRange = table.getColumn("visits")?.getFilterValue() as
    | [number | undefined, number | undefined]
    | undefined

  return (
    <>
      <label>
        Filter role
        <input
          onChange={(event) =>
            table.getColumn("role")?.setFilterValue(event.currentTarget.value)
          }
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
        />
      </label>
      <label>
        Minimum visits
        <input
          onChange={(event) => {
            const value = event.currentTarget.value
            table
              .getColumn("visits")
              ?.setFilterValue(
                value === "" ? undefined : [Number(value), undefined],
              )
          }}
          type="number"
          value={visitRange?.[0] ?? ""}
        />
      </label>
      <button onClick={() => table.resetColumnFilters()} type="button">
        Clear filters
      </button>
      <GuideTable label="Column filtering" table={table} />
    </>
  )
}

function LeafFilteringExample() {
  const data = useMemo(() => makeHierarchicalGuideUsers(), [])
  const [columnFilters, setColumnFilters] =
    useControlledState<ColumnFiltersState>([])
  const table = useReactTable({
    columns,
    data,
    filterFromLeafRows: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      expanded: true,
    },
  })

  return (
    <>
      <button
        onClick={() => table.getColumn("name")?.setFilterValue("Mina")}
        type="button"
      >
        Find Mina
      </button>
      <GuideTable label="Leaf row filtering" table={table} />
    </>
  )
}

describe("Column Filtering Guide", () => {
  test("filters rendered rows by a column value and restores them when cleared", async () => {
    await render(<FilteringExample />)

    await userEvent.type(page.getByLabelText("Filter role"), "Admin")

    await expect.element(page.getByText("Ada Lovelace")).toBeVisible()
    await expect.element(page.getByText("Alicia Stone")).toBeVisible()
    await expect
      .element(page.getByText("Alice Johnson"))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "Clear filters"}).click()

    await expect.element(page.getByText("Alice Johnson")).toBeVisible()
  })

  test("filters a numeric range through a public input", async () => {
    await render(<FilteringExample />)

    await userEvent.type(page.getByLabelText("Minimum visits"), "15")

    await expect.element(page.getByText("Grace Hopper")).toBeVisible()
    await expect.element(page.getByText("Margaret Hamilton")).toBeVisible()
    await expect.element(page.getByText("Ada Lovelace")).not.toBeInTheDocument()
  })

  test("retains a matching parent when filtering from leaf rows", async () => {
    await render(<LeafFilteringExample />)

    await page.getByRole("button", {name: "Find Mina"}).click()

    await expect.element(page.getByText("Ada Lovelace")).toBeVisible()
    await expect.element(page.getByText("Mina Lovelace")).toBeVisible()
    await expect.element(page.getByText("Grace Hopper")).not.toBeInTheDocument()
  })

  test("publishes filters without transforming supplied rows in manual mode", async () => {
    const onFiltersChange = vi.fn()

    await render(<FilteringExample manual onFiltersChange={onFiltersChange} />)

    await userEvent.type(page.getByLabelText("Filter role"), "Admin")

    await expect
      .poll(() => onFiltersChange)
      .toHaveBeenLastCalledWith([{id: "role", value: "Admin"}])
    await expect.element(page.getByText("Linus Torvalds")).toBeVisible()
  })
})
