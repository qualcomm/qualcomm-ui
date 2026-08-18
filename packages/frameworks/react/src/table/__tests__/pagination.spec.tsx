import {useEffect, useMemo, useState} from "react"

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  type TableInstance,
} from "@qualcomm-ui/core/table"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {Table, useReactTable, useTablePagination} from "@qualcomm-ui/react/table"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {getServerPage, makeGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

const columns: ColumnDef<GuideUser>[] = [
  {
    accessorKey: "name",
    cell: (info) => String(info.getValue()),
    header: "Name",
    id: "name",
  },
]

function PaginationControls({
  count,
  table,
}: {
  count: number
  table: TableInstance<GuideUser>
}) {
  const paginationProps = useTablePagination(table, {totalCount: count})

  return (
    <Table.Pagination {...paginationProps}>
      <Pagination.PageMetadata>
        {({count, pageEnd, pageStart}) =>
          `Showing ${pageStart}-${pageEnd} of ${count} users`
        }
      </Pagination.PageMetadata>
      <Pagination.PageButtons />
      <Pagination.PageSize options={[2, 3]}>
        <Pagination.PageSizeLabel>Rows per page</Pagination.PageSizeLabel>
      </Pagination.PageSize>
    </Table.Pagination>
  )
}

function ClientPaginationExample() {
  const data = useMemo(makeGuideUsers, [])
  const [pagination, setPagination] = useControlledState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  })
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {pagination},
  })

  return (
    <>
      <GuideTable label="Client pagination" table={table} />
      <PaginationControls count={data.length} table={table} />
    </>
  )
}

interface ServerPaginationExampleProps {
  loadPage: (pageIndex: number, pageSize: number) => Promise<GuideUser[]>
}

function ServerPaginationExample({loadPage}: ServerPaginationExampleProps) {
  "use no memo"

  const [data, setData] = useState<GuideUser[]>([])
  const [pagination, setPagination] = useControlledState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  })

  useEffect(() => {
    let active = true

    void loadPage(pagination.pageIndex, pagination.pageSize).then((nextData) => {
      if (active) {
        setData(nextData)
      }
    })

    return () => {
      active = false
    }
  }, [loadPage, pagination])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: 3,
    state: {pagination},
  })

  return (
    <>
      <GuideTable label="Server pagination" table={table} />
      <PaginationControls count={6} table={table} />
    </>
  )
}

describe("Pagination Guide", () => {
  test("moves client-side rows between pages", async () => {
    await render(<ClientPaginationExample />)

    await expect
      .element(page.getByText("Showing 1-2 of 6 users"))
      .toBeVisible()
    await expect.element(page.getByText("Ada Lovelace")).toBeVisible()

    await page.getByRole("button", {name: "Go to next page"}).click()

    await expect
      .element(page.getByText("Showing 3-4 of 6 users"))
      .toBeVisible()
    await expect.element(page.getByText("Alicia Stone")).toBeVisible()
    await expect.element(page.getByText("Ada Lovelace")).not.toBeInTheDocument()
  })

  test("changes the client-side page size through the pagination control", async () => {
    await render(<ClientPaginationExample />)

    await page.getByLabelText("Rows per page").click()
    await page.getByRole("menuitem", {name: "3"}).click()

    await expect
      .element(page.getByText("Showing 1-3 of 6 users"))
      .toBeVisible()
    await expect.element(page.getByText("Alicia Stone")).toBeVisible()
  })

  test("loads the next server page from controlled pagination state", async () => {
    const loadPage = vi.fn(async (pageIndex: number, pageSize: number) =>
      getServerPage(pageIndex, pageSize),
    )

    await render(<ServerPaginationExample loadPage={loadPage} />)

    await expect.poll(() => loadPage).toHaveBeenLastCalledWith(0, 2)
    await expect.element(page.getByText("Ada Lovelace")).toBeVisible()

    await page.getByRole("button", {name: "Go to next page"}).click()

    await expect.poll(() => loadPage).toHaveBeenLastCalledWith(1, 2)
    await expect.element(page.getByText("Alicia Stone")).toBeVisible()
  })
})
