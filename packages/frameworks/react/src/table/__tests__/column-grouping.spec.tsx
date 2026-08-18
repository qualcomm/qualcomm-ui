import {useMemo, useState} from "react"

import {Combine, Ungroup} from "lucide-react"

import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  type GroupingColumnMode,
  type GroupingState,
} from "@qualcomm-ui/core/table"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
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
    accessorKey: "visits",
    aggregationFn: "sum",
    cell: (info) => String(info.getValue()),
    header: "Visits",
    id: "visits",
  },
]

interface GroupingExampleProps {
  onGroupingChange?: (grouping: GroupingState) => void
}

function GroupingExample({onGroupingChange}: GroupingExampleProps) {
  const data = useMemo(makeGuideUsers, [])
  const [groupedColumnMode, setGroupedColumnMode] =
    useState<GroupingColumnMode>("reorder")
  const [expanded, setExpanded] = useControlledState({})
  const [grouping, setGrouping] = useControlledState<GroupingState>(
    [],
    onGroupingChange,
  )
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    groupedColumnMode,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    state: {expanded, grouping},
  })

  return (
    <>
      <button
        onClick={() => setGroupedColumnMode("remove")}
        type="button"
      >
        Hide grouped columns
      </button>
      <output aria-live="polite">
        {`Visible columns: ${table
          .getVisibleLeafColumns()
          .map((column) => column.id)
          .join(", ")}`}
      </output>
      <GuideTable
        label="Column grouping"
        renderCell={(cell) => {
          const isHiddenGroupLabel =
            groupedColumnMode === "remove" &&
            cell.column.id === "name" &&
            cell.row.getIsGrouped()

          if (cell.getIsGrouped() || isHiddenGroupLabel) {
            return (
              <>
                {cell.row.getCanExpand() ? (
                  <Table.RowExpandButton row={cell.row} />
                ) : null}
                {`Team group: ${String(
                  cell.getIsGrouped()
                    ? cell.getValue()
                    : cell.row.getGroupingValue("team"),
                )} (${cell.row.subRows.length} users)`}
              </>
            )
          }

          if (cell.getIsAggregated()) {
            return `Total visits: ${String(cell.getValue())}`
          }

          if (cell.getIsPlaceholder()) {
            return null
          }

          return flexRender(cell.column.columnDef.cell, cell.getContext())
        }}
        renderHeaderAction={(header) =>
          header.column.id === "team" ? (
            <Table.ColumnHeaderAction
              aria-label={
                header.column.getIsGrouped() ? "Ungroup Team" : "Group Team"
              }
              icon={header.column.getIsGrouped() ? Ungroup : Combine}
              onClick={header.column.getToggleGroupingHandler()}
            />
          ) : null
        }
        table={table}
      />
    </>
  )
}

describe("Column Grouping Guide", () => {
  test("groups rows, aggregates numeric values, and reorders the grouped column", async () => {
    const onGroupingChange = vi.fn()

    await render(<GroupingExample onGroupingChange={onGroupingChange} />)

    await page.getByRole("button", {name: "Group Team"}).click()

    await expect.poll(() => onGroupingChange).toHaveBeenLastCalledWith([
      "team",
    ])
    await expect
      .element(page.getByText("Visible columns: team, name, visits"))
      .toBeVisible()
    await expect
      .element(page.getByText("Team group: Platform (3 users)"))
      .toBeVisible()
    await expect.element(page.getByText("Total visits: 46")).toBeVisible()
  })

  test("expands and collapses grouped leaf rows through the table expander", async () => {
    await render(<GroupingExample />)

    await page.getByRole("button", {name: "Group Team"}).click()
    await page
      .getByRole("row", {name: /Team group: Platform \(3 users\)/})
      .getByRole("button", {name: "Expand row"})
      .click()

    await expect.element(page.getByText("Ada Lovelace")).toBeVisible()
    await expect.element(page.getByText("Alice Johnson")).toBeVisible()

    await page
      .getByRole("row", {name: /Team group: Platform \(3 users\)/})
      .getByRole("button", {name: "Collapse row"})
      .click()

    await expect.element(page.getByText("Ada Lovelace")).not.toBeInTheDocument()
  })

  test("keeps grouped rows while removing the grouped column", async () => {
    await render(<GroupingExample />)

    await page.getByRole("button", {name: "Group Team"}).click()
    await page.getByRole("button", {name: "Hide grouped columns"}).click()

    await expect
      .element(page.getByText("Visible columns: name, visits"))
      .toBeVisible()
    await expect
      .element(page.getByText("Team group: Platform (3 users)"))
      .toBeVisible()
  })
})
