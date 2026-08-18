import {useMemo} from "react"

import {
  type ColumnDef,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  type PaginationState,
} from "@qualcomm-ui/core/table"
import {Table, useReactTable} from "@qualcomm-ui/react/table"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {makeGuideUsers, makeHierarchicalGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

const nestedColumns: ColumnDef<GuideUser>[] = [
  {
    cell: ({row}) => <Table.RowExpandButton row={row} />,
    header: "Expand",
    id: "expand",
  },
  {
    accessorKey: "name",
    cell: (info) => String(info.getValue()),
    header: "Name",
    id: "name",
  },
]

function NestedExpansionExample({paginateExpandedRows = true}: {paginateExpandedRows?: boolean}) {
  const data = useMemo(makeHierarchicalGuideUsers, [])
  const [expanded, setExpanded] = useControlledState<ExpandedState>({})
  const [pagination, setPagination] = useControlledState<PaginationState>({
    pageIndex: 0,
    pageSize: paginateExpandedRows ? 5 : 1,
  })
  const table = useReactTable({
    columns: nestedColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    paginateExpandedRows,
    state: {expanded, pagination},
  })

  return <GuideTable label="Nested row expansion" table={table} />
}

function DetailExpansionExample() {
  const data = useMemo(makeGuideUsers, [])
  const [expanded, setExpanded] = useControlledState<ExpandedState>({})
  const table = useReactTable({
    columns: nestedColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => row.id,
    onExpandedChange: setExpanded,
    state: {expanded},
  })

  return (
    <GuideTable
      label="Detail row expansion"
      renderRowAfter={(row) =>
        row.getIsExpanded() ? (
          <Table.Row key={`${row.id}-details`}>
            <Table.Cell colSpan={row.getVisibleCells().length}>
              Details for {row.original.name}
            </Table.Cell>
          </Table.Row>
        ) : null
      }
      table={table}
    />
  )
}

describe("Row Expansion Guide", () => {
  test("expands and collapses child rows through the public expander", async () => {
    await render(<NestedExpansionExample />)

    const expandButton = page
      .getByRole("row", {name: "Expand row Ada Lovelace"})
      .getByRole("button", {name: "Expand row"})
    await expandButton.click()

    await expect.element(page.getByText("Mina Lovelace")).toBeVisible()
    await expect.element(page.getByRole("button", {name: "Collapse row"})).toBeVisible()

    await page
      .getByRole("row", {name: "Collapse row Ada Lovelace"})
      .getByRole("button", {name: "Collapse row"})
      .click()

    await expect.element(page.getByText("Mina Lovelace")).not.toBeInTheDocument()
  })

  test("renders custom detail content for a row without sub-rows", async () => {
    await render(<DetailExpansionExample />)

    await page
      .getByRole("row", {name: "Expand row Ada Lovelace"})
      .getByRole("button", {name: "Expand row"})
      .click()

    await expect.element(page.getByText("Details for Ada Lovelace")).toBeVisible()
  })

  test("keeps expanded children on their parent page when configured", async () => {
    await render(<NestedExpansionExample paginateExpandedRows={false} />)

    await page
      .getByRole("row", {name: "Expand row Ada Lovelace"})
      .getByRole("button", {name: "Expand row"})
      .click()

    await expect.element(page.getByText("Mina Lovelace")).toBeVisible()
    await expect.element(page.getByText("Noah Lovelace")).toBeVisible()
  })
})
