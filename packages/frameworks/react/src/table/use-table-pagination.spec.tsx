import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {
  type ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {
  Table,
  useReactTable,
  useTablePagination,
  type UseTablePaginationOptions,
} from "@qualcomm-ui/react/table"

interface Device {
  id: number
  status: string
}

/**
 * 23 devices: 13 online and 10 offline. Neither total is a multiple of the
 * page size.
 */
const devices: Device[] = Array.from({length: 23}, (_, index) => ({
  id: index + 1,
  status: index < 13 ? "Online" : "Offline",
}))

const columnHelper = createColumnHelper<Device>()

const columns = [
  columnHelper.accessor("id", {header: "Id"}),
  columnHelper.accessor("status", {header: "Status"}),
]

/**
 * Takes the props from `useTablePagination` rather than the table. The table
 * instance is stable across renders, so a component that only receives it
 * would not re-render when the page changes.
 */
function PaginationFooter(props: ReturnType<typeof useTablePagination>) {
  return (
    <Table.Root>
      <Table.Pagination {...props}>
        <Pagination.PageMetadata>
          {({count, pageEnd, pageStart}) =>
            `${pageStart}-${pageEnd} of ${count} results`
          }
        </Pagination.PageMetadata>
        <Pagination.NextTrigger />
      </Table.Pagination>
    </Table.Root>
  )
}

function ClientSideTable({
  columnFilters = [],
}: {
  columnFilters?: ColumnFiltersState
}) {
  const table = useReactTable<Device>({
    columns,
    data: devices,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {columnFilters, pagination: {pageIndex: 0, pageSize: 10}},
  })
  return <PaginationFooter {...useTablePagination(table)} />
}

/**
 * The server returns one page of rows and reports four pages in total.
 */
function ManualTable({options}: {options?: UseTablePaginationOptions}) {
  const table = useReactTable<Device>({
    columns,
    data: devices.slice(0, 10),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: 4,
  })
  return <PaginationFooter {...useTablePagination(table, options)} />
}

function getNextButton() {
  return page.getByRole("button", {name: "Go to next page"})
}

describe("useTablePagination", () => {
  describe("client-side pagination", () => {
    test("counts every row when the total isn't a multiple of the page size", async () => {
      await render(<ClientSideTable />)

      await expect.element(page.getByText("1-10 of 23 results")).toBeVisible()
    })

    test("ends the last page at the final row", async () => {
      await render(<ClientSideTable />)

      await getNextButton().click()
      await expect.element(page.getByText("11-20 of 23 results")).toBeVisible()
      await getNextButton().click()

      await expect.element(page.getByText("21-23 of 23 results")).toBeVisible()
    })

    test("counts the rows that match the column filters", async () => {
      await render(
        <ClientSideTable columnFilters={[{id: "status", value: "Online"}]} />,
      )

      await expect.element(page.getByText("1-10 of 13 results")).toBeVisible()
    })
  })

  /**
   * The totalCount warning is logged once per page load, so the tests that
   * expect no warning run first.
   */
  describe("manual pagination", () => {
    test("uses totalCount when it's provided", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      await render(<ManualTable options={{totalCount: 37}} />)

      await expect.element(page.getByText("1-10 of 37 results")).toBeVisible()
      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining("totalCount"),
      )
      warn.mockRestore()
    })

    test("doesn't warn while totalCount is still loading", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      await render(<ManualTable options={{totalCount: undefined}} />)

      await expect.element(page.getByText("1-10 of 40 results")).toBeVisible()
      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining("totalCount"),
      )
      warn.mockRestore()
    })

    test("estimates the count from pageCount without a totalCount", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      await render(<ManualTable />)

      await expect.element(page.getByText("1-10 of 40 results")).toBeVisible()
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("totalCount"))
      warn.mockRestore()
    })
  })
})
