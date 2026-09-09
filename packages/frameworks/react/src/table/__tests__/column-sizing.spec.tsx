import {useMemo} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {
  type ColumnDef,
  type ColumnSizingState,
  getCoreRowModel,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"

import {makeGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

const columns: ColumnDef<GuideUser>[] = [
  {
    accessorKey: "name",
    cell: (info) => String(info.getValue()),
    header: "Name",
    id: "name",
    maxSize: 200,
    minSize: 50,
    size: 100,
  },
  {
    accessorKey: "role",
    cell: (info) => String(info.getValue()),
    enableResizing: false,
    header: "Role",
    id: "role",
  },
]

interface ColumnSizingExampleProps {
  onColumnSizingChange?: (columnSizing: ColumnSizingState) => void
}

function ColumnSizingExample({onColumnSizingChange}: ColumnSizingExampleProps) {
  const data = useMemo(() => makeGuideUsers(), [])
  const [columnSizing, setColumnSizing] = useControlledState<ColumnSizingState>(
    {},
    onColumnSizingChange,
  )
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: {columnSizing},
  })

  return (
    <>
      <button onClick={() => table.setColumnSizing({name: 120})} type="button">
        Set Name width to 120
      </button>
      <button onClick={() => table.setColumnSizing({name: 240})} type="button">
        Set Name width to 240
      </button>
      <button
        onClick={() => table.getColumn("name")?.resetSize()}
        type="button"
      >
        Reset Name width
      </button>
      <output aria-live="polite">
        {`Name column size: ${table.getColumn("name")?.getSize()}`}
      </output>
      <GuideTable label="Column sizing" table={table} />
    </>
  )
}

describe("Column Sizing Guide", () => {
  test("updates controlled column sizing through the public table API", async () => {
    const onColumnSizingChange = vi.fn()

    await render(
      <ColumnSizingExample onColumnSizingChange={onColumnSizingChange} />,
    )

    await page.getByRole("button", {name: "Set Name width to 120"}).click()

    await expect
      .poll(() => onColumnSizingChange)
      .toHaveBeenLastCalledWith({
        name: 120,
      })
    await expect.element(page.getByText("Name column size: 120")).toBeVisible()
  })

  test("restores the configured width through the public column API", async () => {
    await render(<ColumnSizingExample />)

    await page.getByRole("button", {name: "Set Name width to 120"}).click()

    await expect.element(page.getByText("Name column size: 120")).toBeVisible()

    await page.getByRole("button", {name: "Reset Name width"}).click()

    await expect.element(page.getByText("Name column size: 100")).toBeVisible()
  })

  test("limits an externally controlled width to the configured maximum", async () => {
    await render(<ColumnSizingExample />)

    await page.getByRole("button", {name: "Set Name width to 240"}).click()

    await expect.element(page.getByText("Name column size: 200")).toBeVisible()
  })
})
