import {useMemo} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {
  type ColumnDef,
  getCoreRowModel,
  type VisibilityState,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"

import {makeGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

const columns: ColumnDef<GuideUser>[] = [
  {
    accessorKey: "name",
    cell: (info) => String(info.getValue()),
    enableHiding: false,
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
    accessorKey: "status",
    cell: (info) => String(info.getValue()),
    header: "Status",
    id: "status",
  },
]

function ColumnVisibilityExample() {
  const data = useMemo(() => makeGuideUsers(), [])
  const [columnVisibility, setColumnVisibility] =
    useControlledState<VisibilityState>({})
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {columnVisibility},
  })

  return (
    <>
      <fieldset>
        <legend>Visible columns</legend>
        {table.getAllLeafColumns().map((column) => (
          <label key={column.id}>
            <input
              checked={column.getIsVisible()}
              disabled={!column.getCanHide()}
              onChange={(event) =>
                column.toggleVisibility(event.currentTarget.checked)
              }
              type="checkbox"
            />
            Show {String(column.columnDef.header)}
          </label>
        ))}
      </fieldset>
      <GuideTable label="Column visibility" table={table} />
    </>
  )
}

describe("Column Visibility Guide", () => {
  test("hides a column's header and cells through its visibility toggle", async () => {
    await render(<ColumnVisibilityExample />)

    const roleToggle = page.getByRole("checkbox", {name: "Show Role"})
    const table = page.getByRole("table", {name: "Column visibility"})

    await expect.element(roleToggle).toBeChecked()
    await expect.element(table.getByText("Role", {exact: true})).toBeVisible()
    await roleToggle.click()

    await expect.element(roleToggle).not.toBeChecked()
    await expect
      .element(table.getByText("Role", {exact: true}))
      .not.toBeInTheDocument()
    await expect.element(page.getByText("Admin")).not.toBeInTheDocument()
  })

  test("keeps a non-hideable column available", async () => {
    await render(<ColumnVisibilityExample />)

    await expect
      .element(page.getByRole("checkbox", {name: "Show Name"}))
      .toBeDisabled()
    await expect
      .element(
        page
          .getByRole("table", {name: "Column visibility"})
          .getByText("Name", {exact: true}),
      )
      .toBeVisible()
  })
})
