import {useMemo} from "react"

import Fuzzysort from "fuzzysort"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingFn,
  type SortingState,
} from "@qualcomm-ui/core/table"
import {Table, useReactTable} from "@qualcomm-ui/react/table"

import {makeGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

const fuzzyFilter: FilterFn<GuideUser> = (row, columnId, value, addMeta) => {
  const match = Fuzzysort.single(String(value), String(row.getValue(columnId)))
  addMeta({score: match?.score ?? -Infinity})
  return match !== null
}

const fuzzySort: SortingFn<GuideUser> = (rowA, rowB, columnId) => {
  const scoreA = rowA.columnFiltersMeta[columnId]?.score ?? -Infinity
  const scoreB = rowB.columnFiltersMeta[columnId]?.score ?? -Infinity

  return scoreB - scoreA
}

const columns: ColumnDef<GuideUser>[] = [
  {
    accessorKey: "name",
    cell: (info) => String(info.getValue()),
    filterFn: fuzzyFilter,
    header: "Name",
    id: "name",
    sortingFn: fuzzySort,
  },
]

function FuzzyFilteringExample() {
  const data = useMemo(() => makeGuideUsers(), [])
  const [columnFilters, setColumnFilters] =
    useControlledState<ColumnFiltersState>([])
  const [sorting, setSorting] = useControlledState<SortingState>([])
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {columnFilters, sorting},
  })

  return (
    <>
      <label>
        Search names
        <input
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.currentTarget.value)
          }
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        />
      </label>
      <output aria-live="polite">
        {`Visible users: ${table
          .getRowModel()
          .rows.map((row) => row.original.name)
          .join(", ")}`}
      </output>
      <GuideTable
        label="Fuzzy filtering"
        renderHeaderAction={(header) => (
          <Table.ColumnSortAction header={header} />
        )}
        table={table}
      />
    </>
  )
}

describe("Fuzzy Filtering Guide", () => {
  test("keeps an approximate name match", async () => {
    await render(<FuzzyFilteringExample />)

    await userEvent.type(page.getByLabelText("Search names"), "Alce")

    const table = page.getByRole("table", {name: "Fuzzy filtering"})

    await expect.element(table.getByText("Alice Johnson")).toBeVisible()
    await expect
      .element(table.getByText("Grace Hopper"))
      .not.toBeInTheDocument()
  })

  test("sorts fuzzy matches by their match score", async () => {
    await render(<FuzzyFilteringExample />)

    await userEvent.type(page.getByLabelText("Search names"), "Ali")
    await page.getByRole("button", {name: "Sort ascending"}).click()

    await expect
      .element(page.getByText(/Visible users: Alicia Stone, Alice Johnson/))
      .toBeVisible()
  })
})
