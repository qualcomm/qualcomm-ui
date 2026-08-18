import {useMemo} from "react"

import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  type GroupingState,
  type SortingState,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"

import {useControlledState} from "./state"

interface FilterPerson {
  id: number
  labels: string[]
  name: string
  score: number
  status: "Active" | "Pending" | "Suspended"
  strictName: string
}

const filterPeople: FilterPerson[] = [
  {
    id: 1,
    labels: ["math", "systems"],
    name: "Ada",
    score: 12,
    status: "Active",
    strictName: "Alpha",
  },
  {
    id: 2,
    labels: ["math"],
    name: "ALPHA",
    score: 18,
    status: "Pending",
    strictName: "ALPHA",
  },
  {
    id: 3,
    labels: ["systems", "aero"],
    name: "Grace",
    score: 25,
    status: "Active",
    strictName: "Beta",
  },
  {
    id: 4,
    labels: ["flight"],
    name: "Margaret",
    score: 30,
    status: "Suspended",
    strictName: "Gamma",
  },
]

const filterColumns: ColumnDef<FilterPerson>[] = [
  {
    accessorKey: "name",
    filterFn: "includesString",
    id: "includes",
  },
  {
    accessorKey: "strictName",
    filterFn: "includesStringSensitive",
    id: "sensitiveIncludes",
  },
  {
    accessorKey: "strictName",
    filterFn: "equalsString",
    id: "equalsString",
  },
  {
    accessorKey: "status",
    filterFn: "equals",
    id: "equals",
  },
  {
    accessorKey: "id",
    filterFn: "weakEquals",
    id: "weakEquals",
  },
  {
    accessorFn: (person) => person.labels,
    filterFn: "arrIncludes",
    getUniqueValues: (person) => person.labels,
    id: "anyLabel",
  },
  {
    accessorFn: (person) => person.labels,
    filterFn: "arrIncludesAll",
    getUniqueValues: (person) => person.labels,
    id: "allLabels",
  },
  {
    accessorFn: (person) => person.labels,
    filterFn: "arrIncludesSome",
    getUniqueValues: (person) => person.labels,
    id: "someLabels",
  },
  {
    accessorKey: "score",
    filterFn: "inNumberRange",
    id: "scoreRange",
  },
]

function BuiltInFilteringExample() {
  "use no memo"

  const data = useMemo(() => filterPeople, [])
  const [columnFilters, setColumnFilters] =
    useControlledState<ColumnFiltersState>([])
  const table = useReactTable({
    columns: filterColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {columnFilters},
  })

  const setFilter = (id: string, value: unknown) => {
    table.setColumnFilters([{id, value}])
  }
  const names = table
    .getRowModel()
    .rows.map((row) => row.original.name)
    .join(", ")

  return (
    <>
      <button
        onClick={() => setFilter("includes", "ad")}
        type="button"
      >
        Find names containing ad
      </button>
      <button
        onClick={() => setFilter("sensitiveIncludes", "Alpha")}
        type="button"
      >
        Find exact-case Alpha
      </button>
      <button
        onClick={() => setFilter("equalsString", "alpha")}
        type="button"
      >
        Find names equal to alpha
      </button>
      <button onClick={() => setFilter("equals", "Active")} type="button">
        Find active users
      </button>
      <button onClick={() => setFilter("weakEquals", "2")} type="button">
        Find user ID 2
      </button>
      <button onClick={() => setFilter("anyLabel", "systems")} type="button">
        Find any systems label
      </button>
      <button
        onClick={() => setFilter("allLabels", ["math", "systems"])}
        type="button"
      >
        Find all math and systems labels
      </button>
      <button
        onClick={() => setFilter("someLabels", ["aero", "flight"])}
        type="button"
      >
        Find some aero or flight labels
      </button>
      <button
        onClick={() => setFilter("scoreRange", ["25", "15"])}
        type="button"
      >
        Find scores from 15 to 25
      </button>
      <button
        onClick={() => table.getColumn("includes")?.setFilterValue("")}
        type="button"
      >
        Clear name search
      </button>
      <button
        onClick={() => table.getColumn("allLabels")?.setFilterValue([])}
        type="button"
      >
        Clear required labels
      </button>
      <button
        onClick={() =>
          table
            .getColumn("scoreRange")
            ?.setFilterValue([undefined, undefined])
        }
        type="button"
      >
        Clear score range
      </button>
      <output aria-live="polite">{`Matching people: ${names}`}</output>
    </>
  )
}

interface SortPerson {
  alphanumeric: string
  alphanumericCaseSensitive: string
  basic: number
  datetime: Date
  name: string
  text: string
  textCaseSensitive: string
}

const sortPeople: SortPerson[] = [
  {
    alphanumeric: "release10",
    alphanumericCaseSensitive: "release10",
    basic: 2,
    datetime: new Date("2024-03-01T00:00:00.000Z"),
    name: "First",
    text: "bravo",
    textCaseSensitive: "alpha",
  },
  {
    alphanumeric: "release2",
    alphanumericCaseSensitive: "Release2",
    basic: 1,
    datetime: new Date("2024-01-01T00:00:00.000Z"),
    name: "Second",
    text: "Alpha",
    textCaseSensitive: "Bravo",
  },
  {
    alphanumeric: "release1",
    alphanumericCaseSensitive: "release1",
    basic: 3,
    datetime: new Date("2024-02-01T00:00:00.000Z"),
    name: "Third",
    text: "charlie",
    textCaseSensitive: "charlie",
  },
]

const sortColumns: ColumnDef<SortPerson>[] = [
  {
    accessorKey: "basic",
    id: "basic",
    sortingFn: "basic",
  },
  {
    accessorKey: "text",
    id: "text",
    sortingFn: "text",
  },
  {
    accessorKey: "textCaseSensitive",
    id: "textCaseSensitive",
    sortingFn: "textCaseSensitive",
  },
  {
    accessorKey: "alphanumeric",
    id: "alphanumeric",
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "alphanumericCaseSensitive",
    id: "alphanumericCaseSensitive",
    sortingFn: "alphanumericCaseSensitive",
  },
  {
    accessorKey: "datetime",
    id: "datetime",
    sortingFn: "datetime",
  },
]

function BuiltInSortingExample() {
  "use no memo"

  const data = useMemo(() => sortPeople, [])
  const [sorting, setSorting] = useControlledState<SortingState>([])
  const table = useReactTable({
    columns: sortColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {sorting},
  })
  const names = table
    .getRowModel()
    .rows.map((row) => row.original.name)
    .join(", ")

  return (
    <>
      {sortColumns.map((column) => (
        <button
          key={column.id}
          onClick={() => table.setSorting([{desc: false, id: column.id!}])}
          type="button"
        >
          {`Sort by ${column.id}`}
        </button>
      ))}
      <output aria-live="polite">{`Sorted people: ${names}`}</output>
    </>
  )
}

interface MetricPerson {
  category: "Kernel" | "Platform"
  id: string
  median: number
  quantity: number | undefined
  status: "Active" | "Pending" | "Suspended"
}

const metricPeople: MetricPerson[] = [
  {
    category: "Platform",
    id: "ada",
    median: 12,
    quantity: 12,
    status: "Active",
  },
  {
    category: "Platform",
    id: "alice",
    median: 20,
    quantity: 20,
    status: "Active",
  },
  {
    category: "Platform",
    id: "alicia",
    median: 24,
    quantity: undefined,
    status: "Pending",
  },
  {
    category: "Kernel",
    id: "linus",
    median: 4,
    quantity: 4,
    status: "Active",
  },
  {
    category: "Kernel",
    id: "margaret",
    median: 8,
    quantity: 8,
    status: "Suspended",
  },
]

const metricColumnHelper = createColumnHelper<MetricPerson>()

const metricColumns: ColumnDef<MetricPerson>[] = [
  metricColumnHelper.display({
    cell: () => null,
    header: "Actions",
    id: "actions",
  }),
  metricColumnHelper.group({
    columns: [
      metricColumnHelper.accessor("category", {
        header: "Category",
        id: "category",
      }),
      metricColumnHelper.accessor("quantity", {
        aggregationFn: "sum",
        id: "sum",
      }),
      metricColumnHelper.accessor("quantity", {
        aggregationFn: "min",
        id: "min",
      }),
      metricColumnHelper.accessor("quantity", {
        aggregationFn: "max",
        id: "max",
      }),
      metricColumnHelper.accessor("quantity", {
        aggregationFn: "extent",
        id: "extent",
      }),
      metricColumnHelper.accessor("quantity", {
        aggregationFn: "mean",
        id: "mean",
      }),
      metricColumnHelper.accessor((person) => person.median, {
        aggregationFn: "median",
        id: "median",
      }),
      metricColumnHelper.accessor("status", {
        aggregationFn: "unique",
        id: "unique",
      }),
      metricColumnHelper.accessor("status", {
        aggregationFn: "uniqueCount",
        id: "uniqueCount",
      }),
      metricColumnHelper.accessor("status", {
        aggregationFn: "count",
        id: "count",
      }),
    ],
    header: "Metrics",
    id: "metrics",
  }),
]

function GroupedAggregationExample() {
  "use no memo"

  const data = useMemo(() => metricPeople, [])
  const [grouping, setGrouping] = useControlledState<GroupingState>([])
  const table = useReactTable({
    columns: metricColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onGroupingChange: setGrouping,
    state: {grouping},
  })
  const groupedRows = grouping.length ? table.getGroupedRowModel().rows : []

  return (
    <>
      <button
        onClick={() => table.setGrouping(["category"])}
        type="button"
      >
        Summarize categories
      </button>
      <ul aria-label="Category summaries">
        {groupedRows.map((row) => {
          const extent = row.getValue<[number, number]>("extent")
          const unique = row.getValue<string[]>("unique")

          return (
            <li key={row.id}>
              {`${String(row.getGroupingValue("category"))}: sum ${String(
                row.getValue("sum"),
              )}, min ${String(row.getValue("min"))}, max ${String(
                row.getValue("max"),
              )}, extent ${extent.join(" to ")}, mean ${String(
                row.getValue("mean"),
              )}, median ${String(row.getValue("median"))}, unique ${unique.join(
                " and ",
              )}, unique count ${String(
                row.getValue("uniqueCount"),
              )}, count ${String(row.getValue("count"))}`}
            </li>
          )
        })}
      </ul>
    </>
  )
}

interface FacetPerson {
  name: string
  status: "Active" | "Pending" | "Suspended"
  unavailable: number | undefined
  visits: number | undefined
}

const facetPeople: FacetPerson[] = [
  {
    name: "Ada",
    status: "Active",
    unavailable: Number.NaN,
    visits: 12,
  },
  {
    name: "Grace",
    status: "Active",
    unavailable: Number.NaN,
    visits: undefined,
  },
  {
    name: "Linus",
    status: "Pending",
    unavailable: undefined,
    visits: 25,
  },
  {
    name: "Mina",
    status: "Suspended",
    unavailable: Number.NaN,
    visits: Number.NaN,
  },
]

const facetColumns: ColumnDef<FacetPerson>[] = [
  {
    accessorKey: "name",
    id: "name",
  },
  {
    accessorKey: "status",
    filterFn: "equalsString",
    id: "status",
  },
  {
    accessorKey: "visits",
    id: "visits",
  },
  {
    accessorKey: "unavailable",
    id: "unavailable",
  },
]

function FacetedValuesExample() {
  "use no memo"

  const data = useMemo(() => facetPeople, [])
  const [columnFilters, setColumnFilters] =
    useControlledState<ColumnFiltersState>([])
  const table = useReactTable({
    columns: facetColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {columnFilters},
  })
  const statusValues = Array.from(
    table.getColumn("status")?.getFacetedUniqueValues() ?? [],
  )
    .map(([value, count]) => `${String(value)} (${count})`)
    .join(", ")
  const visitsRange = table.getColumn("visits")?.getFacetedMinMaxValues()
  const unavailableRange = table
    .getColumn("unavailable")
    ?.getFacetedMinMaxValues()
  const names = table
    .getRowModel()
    .rows.map((row) => row.original.name)
    .join(", ")

  return (
    <>
      <button
        onClick={() => table.getColumn("status")?.setFilterValue("Active")}
        type="button"
      >
        Show active users
      </button>
      <button onClick={() => table.resetColumnFilters()} type="button">
        Show all users
      </button>
      <output aria-live="polite">{`Visible users: ${names}`}</output>
      <output>{`Status facet values: ${statusValues}`}</output>
      <output>{`Visit range: ${visitsRange?.join(" to ") ?? "none"}`}</output>
      <output>{`Unavailable range: ${
        unavailableRange?.join(" to ") ?? "none"
      }`}</output>
    </>
  )
}

describe("Core Table Utilities", () => {
  test("filters rendered rows with each built-in filter strategy", async () => {
    await render(<BuiltInFilteringExample />)

    const filters = [
      ["Find names containing ad", "Ada"],
      ["Find exact-case Alpha", "Ada"],
      ["Find names equal to alpha", "Ada, ALPHA"],
      ["Find active users", "Ada, Grace"],
      ["Find user ID 2", "ALPHA"],
      ["Find any systems label", "Ada, Grace"],
      ["Find all math and systems labels", "Ada"],
      ["Find some aero or flight labels", "Grace, Margaret"],
      ["Find scores from 15 to 25", "ALPHA, Grace"],
    ] as const

    for (const [buttonName, expectedNames] of filters) {
      await page.getByRole("button", {name: buttonName}).click()
      await expect
        .element(page.getByText(`Matching people: ${expectedNames}`))
        .toBeVisible()
    }

    await page.getByRole("button", {name: "Find names containing ad"}).click()
    await page.getByRole("button", {name: "Clear name search"}).click()
    await expect
      .element(page.getByText("Matching people: Ada, ALPHA, Grace, Margaret"))
      .toBeVisible()

    await page
      .getByRole("button", {name: "Find all math and systems labels"})
      .click()
    await page.getByRole("button", {name: "Clear required labels"}).click()
    await expect
      .element(page.getByText("Matching people: Ada, ALPHA, Grace, Margaret"))
      .toBeVisible()

    await page.getByRole("button", {name: "Find scores from 15 to 25"}).click()
    await page.getByRole("button", {name: "Clear score range"}).click()
    await expect
      .element(page.getByText("Matching people: Ada, ALPHA, Grace, Margaret"))
      .toBeVisible()
  })

  test("sorts rendered rows with each built-in sorting strategy", async () => {
    await render(<BuiltInSortingExample />)

    const sortOrders = [
      ["basic", "Second, First, Third"],
      ["text", "Second, First, Third"],
      ["textCaseSensitive", "Second, First, Third"],
      ["alphanumeric", "Third, Second, First"],
      ["alphanumericCaseSensitive", "Second, Third, First"],
      ["datetime", "Second, Third, First"],
    ] as const

    for (const [columnId, expectedNames] of sortOrders) {
      await page
        .getByRole("button", {exact: true, name: `Sort by ${columnId}`})
        .click()
      await expect
        .element(page.getByText(`Sorted people: ${expectedNames}`))
        .toBeVisible()
    }
  })

  test("renders grouped summaries with each built-in aggregation", async () => {
    await render(<GroupedAggregationExample />)

    await page.getByRole("button", {name: "Summarize categories"}).click()

    await expect
      .element(
        page.getByText(
          "Platform: sum 32, min 12, max 20, extent 12 to 20, mean 16, median 20, unique Active and Pending, unique count 2, count 3",
        ),
      )
      .toBeVisible()
    await expect
      .element(
        page.getByText(
          "Kernel: sum 12, min 4, max 8, extent 4 to 8, mean 6, median 6, unique Active and Suspended, unique count 2, count 2",
        ),
      )
      .toBeVisible()
  })

  test("derives faceted values from the other active filters", async () => {
    await render(<FacetedValuesExample />)

    await page.getByRole("button", {name: "Show active users"}).click()

    await expect.element(page.getByText("Visible users: Ada, Grace")).toBeVisible()
    await expect
      .element(
        page.getByText(
          "Status facet values: Active (2), Pending (1), Suspended (1)",
        ),
      )
      .toBeVisible()
    await expect.element(page.getByText("Visit range: 12 to 12")).toBeVisible()
    await expect.element(page.getByText("Unavailable range: none")).toBeVisible()

    await page.getByRole("button", {name: "Show all users"}).click()
    await expect
      .element(page.getByText("Visible users: Ada, Grace, Linus, Mina"))
      .toBeVisible()
    await expect.element(page.getByText("Visit range: 12 to 25")).toBeVisible()
  })
})
